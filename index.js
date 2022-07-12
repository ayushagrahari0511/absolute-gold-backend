const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const video = require('./routes/video')

// Acess to Environmet Variable ------------
// ------------------

dotenv.config()

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Initializing express app-------------------
// ------------------------
const app = express()

// Configuring Cors --------------------
// -------------------------

const whitelist = ['http://localhost:3000', 'https://absolute-gold.vercel.app']
// const corsOption = {
//     origin: function (origin, callback) {
//         if(whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         }
//         else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     optionsSuccessStatus: 200
// }

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/assets', video)

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