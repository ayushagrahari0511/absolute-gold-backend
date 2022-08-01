const express = require('express')
const { get_orders, checkout, webhook } = require('../controllers/orderController')
const { isAuthenticatedUser } = require('../middlewares/auth')

const router = express.Router()

router.get('/order', isAuthenticatedUser, get_orders)

router.post('/checkout', isAuthenticatedUser, checkout)

module.exports = router