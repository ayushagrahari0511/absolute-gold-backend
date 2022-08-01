const mongoose = require("mongoose")

const productModel = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter the Title"]
    },
    sku: {
        type: String
    },
    desc: {
        type: String,
        required: [true, "Please Enter the description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price"]
    },
    onDiscount: {
        type: Number,
        required: [true, "Please Enter the discount Price"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter Stock"],
        default: 1
    },
    img: [
        {
            fileName: String
        }
    ],
    features: {
        color: String,
        grossWt: String,
        netWt: String,
        hallmark: Boolean,
        metalGold: String
    },
    rating: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: [true, "Please Enter the product Category"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            userName: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    subCategory: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Product', productModel)