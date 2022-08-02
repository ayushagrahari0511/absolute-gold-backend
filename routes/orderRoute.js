const express = require('express')
const { get_orders, checkout, webhook, payment_success } = require('../controllers/orderController')
const { isAuthenticatedUser } = require('../middlewares/auth')

const router = express.Router()

router.get('/order', isAuthenticatedUser, get_orders)

router.post('/checkout', isAuthenticatedUser, checkout)

router.get('/payment_success/:id', payment_success)

module.exports = router