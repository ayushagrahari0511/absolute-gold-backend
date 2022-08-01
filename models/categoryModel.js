const mongoose = require('mongoose')

const categoryModel = new mongoose.Schema({
    title: String,
    img: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    subCategory: [
        {
            title: String,
        },
        {
            img: {
                public_id: {
                    type: String
                },
                url: {
                    type: String
                }
            }
        },
    ]
})

module.exports = mongoose.model("Category", categoryModel)