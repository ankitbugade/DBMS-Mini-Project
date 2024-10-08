const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const routes = require("./api/routes/index");
const connectDB = require("./db_connection");
const mongoose = require("mongoose"); // Import mongoose

const app = express();
dotenv.config();

// Suppress Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

// Middleware
app.use(morgan("dev"));

// Database Connection
connectDB(); // Call the database connection function

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000", // Location of the React app
        credentials: true,
    })
);
app.use(
    session({
        secret: process.env.SECRET || "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, priority: "High" },
    })
);
app.use(cookieParser(process.env.SECRET));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passportConfig")(passport); // Passport configuration

// Routes
app.use(routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
