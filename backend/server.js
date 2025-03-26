const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./dbConnection");
require("dotenv").config();//Load the .env file


const authRoutes = require("./routes/authRoutes");
const ovpnRoutes = require("./routes/ovpnRoutes");

const app = express();
connectDB().then( async client => {
    const db = client.db("VPNApp"); // Create/Connect the VPNApp database
    app.locals.db = db;  // Attach db to app locals so routes can access it


    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/ovpn", ovpnRoutes);

    async function populateOvpnFiles() {
        try {
          const ovpnFilesCollection = db.collection('servers');
      
          const ovpnDir = path.join(__dirname, 'ovpnFiles'); // Directory containing .ovpn files
          const files = fs.readdirSync(ovpnDir).filter(file => file.endsWith('.ovpn'));
          console.log(files);
      
          for (const file of files) {
            const filePath = path.join(ovpnDir, file);
            const content = fs.readFileSync(filePath, 'base64'); // Read and encode content to Base64
      
            const serverName = path.basename(file, '.ovpn'); // Use filename (without extension) as server name
      
            const existingFile = await ovpnFilesCollection.findOne({ fileName: file });
            if (!existingFile) { // Avoid duplicates
              await ovpnFilesCollection.insertOne({
                serverName,
                fileName: file,
                content, // Store Base64 content
                createdAt: new Date(),
              });
              console.log(`Inserted ${file} into MongoDB`);
            } else {
              console.log(`File ${file} already exists in the database.`);
            }
          }
        } catch (error) {
          console.error('Error populating .ovpn files:', error);
        }
      }

    // **Store VPN Configurations on Server Startup**
    try {
        await populateOvpnFiles(); // Populate the database on server start
        
    } catch (error) {
        console.error("Error inserting configurations:", error);
    }

    app.listen(3500, () => console.log("Server running on port 3500"));

}

).catch(console.error);


