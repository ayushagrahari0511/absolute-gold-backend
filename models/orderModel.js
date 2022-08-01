const mongoose = require('mongoose')


const orderModel = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    orderNo: {
        type: String
    },
    orders: [
        {
            title: String,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            price: Number
        }
    ],
    name: String,
    email: String,
    phone: Number,
    notes: String,
    bill: Number,
    paymentMethod: String,
    status: {
        type: String,
        default: "processing"
    },
    billingAddress: {
        city: String,
        address: String,
        postalCode: Number,
        country: String,
    },
    // deliveryAddress: {
    //     City: String,
    //     address: String,
    //     postalCode: Number,
    //     notes: String,
    //     country: String,
    // },
}, { timestamps: true })


module.exports = mongoose.model('Order', orderModel)