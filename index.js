const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const video = require('./routes/video')
const dbConnect = require('./database')
const error = require('./middlewares/error')
const cloudinary = require('cloudinary')
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const categoryRoute = require('./routes/categoryRoute')
const orderRoute = require('./routes/orderRoute')
const { webhook } = require('./controllers/orderController')

// Acess to Environmet Variable ------------
// ------------------

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config()
}

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Connecting to database-----------------------
// -----------------

dbConnect()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Initializing express app-------------------
// ------------------------
const app = express()
app.post('/api/webhook', express.raw({type: 'application/json'}), webhook)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

// Configuring Cors --------------------
// -------------------------

const whitelist = ['http://localhost:3000', , 'http://localhost:5000' , 'https://absolute-gold.vercel.app', 'https://bizinnovisiondev.co']
const corsOption = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOption))
// app.use(cors({credentials: true}))
app.use(express.json())

// Serve Static Assets
app.use('/assets', express.static('assets'))

// Register all routes here
app.use('/assets', video);
app.use('/api', userRoute);
app.use('/api' , productRoute);
app.use('/api', categoryRoute);
app.use('/api', cartRoute);
app.use('/api', orderRoute);


// Middleware for Errors
app.use(error)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`)
})


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});