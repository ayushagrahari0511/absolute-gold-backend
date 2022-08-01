const mongoose = require('mongoose')
const validator = require('validator')


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            title: {
                type: String
            },
            desc: {
                type: String
            },
            img: {
                type: String
            },
            price: {
                type: Number,
            },
            quantity: {
                type: Number
            },
        }
    ],
    bill: {
        type: Number
    }
})

module.exports = mongoose.model('Cart', cartSchema)