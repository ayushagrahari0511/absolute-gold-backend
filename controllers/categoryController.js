const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require('cloudinary')
const Category = require('../models/categoryModel')

exports.createCategory =async (req, res, next) => {
    const {title, subCategory} = req.body;

    if(!title) {
        return next(new ErrorHandler("Please enter all the details", 405))
    }

    try {
        const result = await cloudinary.v2.uploader.upload(
            req.file.path, 
            {
                folder: "assets"
            }
        )
        fs.unlinkSync(req.file.path)

        const category = await Category.create({
            title,
            subCategory,
            img: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })

        res.status(200).json({
            success: true,
            category
        })
    }
    catch(err) {
        fs.unlinkSync(req.file.path)
        return new ErrorHandler("Internal Server Error", 500)
    }
}