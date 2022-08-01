const express = require('express')
const multer = require('multer')
const path = require('path')
const { createCategory } = require('../controllers/categoryController')
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "temp/"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 100000 * 0.5
    }
})

router.post('/category', [isAuthenticatedUser, authorizeRoles(["admin"]), upload.single("image")], createCategory)

module.exports = router