const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./dbConnection");
require("dotenv").config();//Load the .env file


const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();
connectDB().then( async client => {
    const db = client.db("VPNApp"); // Create/Connect the VPNApp database
    app.locals.db = db;  // Attach db to app locals so routes can access it


    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/test", testRoutes);

    app.listen(3500, () => console.log("Server running on port 3500"));

}

).catch(console.error);


