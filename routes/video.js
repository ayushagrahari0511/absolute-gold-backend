const express = require('express')
const {video} = require('../controllers/videoController')

const router = express.Router()

router.get('/video', video)

module.exports = router;