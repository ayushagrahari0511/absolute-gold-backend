const express = require('express')
const { registerUser, loginUser, getUserDetails, logoutUser } = require('../controllers/userController')
const { isAuthenticatedUser } = require('../middlewares/auth')



const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/me', isAuthenticatedUser, getUserDetails)

router.post('/logout', isAuthenticatedUser, logoutUser)

module.exports = router