const ErrorHandler = require("../utils/errorHandler")
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const { v4: uuidv4 } = require('uuid')
const newId = uuidv4()
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config()
}
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const endpointSecret = "whsec_Sa8VjsK43v6jcmQxpwoojCFQTkwaoULh"

exports.get_orders = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const order = await Order.find({ userId }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            order
        })
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
}


exports.checkout = async (req, res, next) => {
    const userId = req.user._id;
    const { name, email, phone, country, city, postalCode, address, notes } = req.body
    try {
        // fetch the cart of the user---------
        let cart = await Cart.findOne({
            userId
        })

        // get the list of the product -------------
        let products = cart.items

        let stock = true

        const productId = []
        // check if the product is out of stock or not------
        for (i = 0; i < products.length; i++) {
            let id = products[i].productId
            const product = await Product.findById(id)

            if (product.stock < products[i].quantity) {
                stock = false;
            }
        }

        // proceed the order
        if (stock) {
            try {

                // Receive payment here----------
                // ----------------
                const paymentIntent = await stripe.paymentIntents.create(
                    {
                        amount: cart.bill * 100,
                        currency: 'usd',
                        description: "Mango factory",
                        receipt_email: email,
                        metadata: {
                            cartId: String(cart._id),
                            totalItems: products.length,
                            notes
                        },
                        shipping: {
                            name,
                            address: {
                                line1: address,
                                postal_code: postalCode,
                                city,
                                country
                            },
                            phone
                        },
                        automatic_payment_methods: {
                            enabled: true,
                        }
                    }
                )

                res.status(200).json({
                    clientSecret: paymentIntent.client_secret
                })
            }
            catch (err) {
                return res.status(500).send(null)
            }
        }
        else {
            return res.status(500).send(null)
        }
    }
    catch (err) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }

}

exports.webhook = async (req, res, next) => {
    let event = req.body;

    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.

            let cart = await Cart.findById(paymentIntent.metadata.cartId)
            let products = cart.items

            let orders = []

            for (i = 0; i < products.length; i++) {
                const { title, productId, quantity, price } = products[i]
                orders.push({
                    title,
                    productId,
                    quantity,
                    price,
                })
            }

            // Creating the order
            const order = await Order.create({
                userId: cart.userId,
                orderNo: newId,
                orders,
                name: paymentIntent.shipping.name,
                email: paymentIntent.receipt_email,
                phone: paymentIntent.shipping.phone,
                notes: paymentIntent.metadata.notes,
                bill: cart.bill,
                paymentMethod: paymentIntent.payment_method_types[0],
                billingAddress: {
                    city: paymentIntent.shipping.address.city,
                    address: paymentIntent.shipping.address.line1,
                    postalCode: paymentIntent.shipping.address.postal_code,
                    country: paymentIntent.shipping.address.country,
                },
            })

            for (i = 0; i < products.length; i++) {
                let id = products[i].productId
                let product = await Product.findById(id)

                product.stock -= products[i].quantity;
                product.save();
            }

            const data = await Cart.findByIdAndDelete(paymentIntent.metadata.cartId)

            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).json({
        success: true
    })
}