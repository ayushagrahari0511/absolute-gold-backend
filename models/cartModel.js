const mongoose = require('mongoose')
const validator = require('validator')


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    items: [
        {
            productId: {
                type: mongoose.Types.ObjectId
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
            }
        }
    ]
})

module.exports = mongoose.model('Cart', cartSchema)