const express = require('express')
const { getAllProduct, createProduct, deleteProduct, getSingleProduct } = require('../controllers/productController')
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth')
const multer = require('multer')
const cloudinary = require('cloudinary')
const path = require('path')
const Product = require('../models/productModel')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "assets/"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 100000 * 0.5
    }
})

// Get all products
router.get('/products', getAllProduct)

// Get single product
router.get('/product/:id', getSingleProduct)

// creating product ---Seller
router.post("/create-product", [isAuthenticatedUser, authorizeRoles(["seller"]), upload.array("image")], createProduct)

// deleting product --Seller
router.delete('/product/:id', [isAuthenticatedUser, authorizeRoles(["seller"])], deleteProduct)
module.exports = router