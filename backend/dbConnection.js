// db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB ATLAS URI
//const uri = "mongodb+srv://user:password@cluster0.7m91o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//URI al servicio de mongo en local
const uri = "mongodb://localhost:27017/"; 

// Create a MongoClient instance with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to connect to MongoDB and return the client
async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Export the function to connect to the database
module.exports = connectDB;
