const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

require("dotenv").config();

const router = express.Router();

console.log(process.env.JWT_SECRET)

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });
  
    try {
    console.log("Token:", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };


router.get("/", authenticate, async (req, res) => {

    const db = req.app.locals.db;//access to the local shared db
    const ovpnFilesCollection = db.collection('servers');
    try {
        const servers = await ovpnFilesCollection.find().toArray();
        console.log("Servers retrieved:", servers);
        res.json(servers);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error retrieving users" });
      }
});


module.exports = router;