const ErrorHandler = require("../utils/errorHandler")
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')

exports.getCart = async (req, res, next) => {
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({
            userId
        })

        if (cart && cart.items.length > 0) {
            res.status(200).json({
                success: true,
                cart
            })
        }
        else (
            res.status(201).send(null)
        )
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
}

// Adding Item to user Cart
exports.addToCart = async (req, res, next) => {

    const productId = req.params.id;
    const userId = req.user._id
    try {

        // search product in database
        let product = await Product.findById(productId)
        let cart = await Cart.findOne({ userId })

        const { title, desc, onDiscount, img } = product

        // returning waring if product not found
        if (!product) {
            return next(new ErrorHandler("Product not found", 404))
        }

        // returning warning if out of stock
        if (product.stock < 1) {
            return next(new ErrorHandler("Product is out of stock", 404))
        }

        // if Cart exists for the user
        if (cart) {
            const itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId))

            if (itemIndex > -1) {
                // updating the product if exists in the cart
                let productItem = cart.items[itemIndex];
                productItem.quantity += 1;
                cart.items[itemIndex] = productItem;
            }
            else {
                cart.items.push({
                    productId,
                    title,
                    desc,
                    price: onDiscount,
                    quantity: 1,
                    img: img[0].fileName
                })
            }

            cart.bill += 1 * onDiscount
            cart = await cart.save();;
            return res.status(201).json({
                success: true,
                cart
            })
        }
        else {
            // if Card does't exists, then creat one for the user
            const newCart = await Cart.create({
                userId,
                items: [
                    {
                        productId,
                        title,
                        desc,
                        price: onDiscount,
                        quantity: 1,
                        img: img[0].fileName
                    }
                ],
                bill: onDiscount
            })

            return res.status(201).json({
                success: true,
                cart: newCart
            })
        }
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
}

exports.incrementQuantity = async (req, res, next) => {

    //User id 
    const userId = req.user._id;

    // product id
    const productId = req.params.id;

    try {
        let cart = await Cart.findOne({ userId })
        let itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId))

        // Increasing quantity of product
        if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];
            productItem.quantity += 1;
            cart.bill += 1 * productItem.price
        }

        // Saving Cart to db
        cart = await cart.save();;
        return res.status(200).json({
            success: true,
            cart
        })
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
}

exports.decrementQuantity = async (req, res, next) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        let cart = await Cart.findOne({ userId })

        let itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId))
        if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];
            if (productItem.quantity > 1) {
                productItem.quantity -= 1
                cart.bill -= 1 * productItem.price
            }
        }

        cart = await cart.save();;
        return res.status(200).json({
            success: true,
            cart
        })
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
}


exports.deleteItem = async (req, res, next) => {

    const userId = req.user._id;
    const productId = req.params.id;
    try {
        let cart = await Cart.findOne({ userId });
        const itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId))

        if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];

            cart.bill -= productItem.quantity * productItem.price;
            cart.items.splice(itemIndex, 1);
        }

        cart = await cart.save();
        return res.status(201).json({
            success: true,
            cart
        })
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
}