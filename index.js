const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const video = require('./routes/video')
const dbConnect = require('./database')
const error = require('./middlewares/error')
const userRoute = require('./routes/userRoute')

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

// Initializing express app-------------------
// ------------------------
const app = express()
app.use(cookieParser())

// Configuring Cors --------------------
// -------------------------

const whitelist = ['http://localhost:3000', 'https://absolute-gold.vercel.app', 'https://bizinnovisiondev.co']
const corsOption = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
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
app.use(express.json())

// Register all routes here
app.use('/assets', video)
app.use('/api', userRoute)

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