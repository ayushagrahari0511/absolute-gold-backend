const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Database Connection successful')
    }).catch((err) => {
        console.log(`Database connection failed`)
    })
};

module.exports = dbConnect;