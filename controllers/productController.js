const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/productModel")
const ErrorHandler = require('../utils/errorHandler')
const fs = require('fs')
const cloudinary = require('cloudinary');
const ApiFeature = require("../utils/apiFeature");
const sharp = require('sharp')


exports.getAllProduct = catchAsyncError(
    async (req, res, next) => {

        const productCount = await Product.countDocuments();
        const result = new ApiFeature(Product.find(), req.query).search().filter().pagination(20);
        const products = await result.query;

        res.status(200).json({
            success: true,
            products,
            productCount
        })
    }
)

exports.createProduct =
    async (req, res, next) => {
        const imagePath = []

        const {
            title, sku, stock,
            desc, price, onDiscount,
            category, subCategory, color,
            grossWt, netWt, hallmark,
            metalGold
        } = req.body

        try {

            // Validating if all the fields are filled
            if (!title || !desc || !price || !onDiscount || !category || !subCategory) {
                return next(new ErrorHandler("All fields are mandatory", 405))
            }

            // Uploading files to the server
            for (var i = 0; i < req.files.length; i++) {
                imagePath.push({
                    fileName: req.files[i].path
                })
            }

            // Pushing data to database
            const product = await Product.create({
                title,
                sku,
                desc,
                stock,
                price,
                onDiscount,
                category,
                subCategory,
                img: imagePath,
                features: {
                    color,
                    grossWt,
                    netWt,
                    metalGold,
                    hallmark
                },
                user: req.user._id
            })

            res.status(200).json({
                success: true,
                product
            })
        }
        catch (err) {
            return new ErrorHandler("Internal Server Error", 500)
        }
    }


exports.deleteProduct = catchAsyncError(
    async (req, res, next) => {
        //    Checking product in database
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "product not found"
            })
        }

        // Validating the product's Seller
        if (String(product.user) === String(req.user._id)) {
            // Deleting Images from Server
            for (let i = 0; i < product.img.length; i++) {
                fs.unlinkSync(product.img[i].fileName)
            }

            // Deleting the product
            await product.remove();
            return res.status(200).json({
                success: true,
                product
            })
        }
        else {
            return res.status(500).json({
                success: false,
                message: "Wrong product"
            })
        }
    }
)

exports.getSingleProduct = catchAsyncError(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id)

        if(!product) {
            return next(new ErrorHandler("Product not found", 404))
        }

        res.status(200).json({
            success: true,
            product
        })
    }
)