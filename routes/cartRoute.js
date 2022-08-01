const express = require('express')
const { addToCart, deleteItem, getCart, incrementQuantity, decrementQuantity } = require('../controllers/cartController')
const { isAuthenticatedUser } = require('../middlewares/auth')

const router = express.Router()

// Get Cart details
router.get('/cart', isAuthenticatedUser, getCart)

// Creating Cart for the user
router.post('/cart/:id', isAuthenticatedUser, addToCart )

// Increasing quantity of the product
router.get('/increment/:id', isAuthenticatedUser, incrementQuantity)

// Decreasing quantity of the product
router.get('/decrement/:id', isAuthenticatedUser, decrementQuantity)

// Deleting product from the cart
router.delete('/cart/:id', isAuthenticatedUser, deleteItem)


module.exports = router