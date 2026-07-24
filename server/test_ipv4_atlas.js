const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb+srv://trishadm02_db_user:trisha02082006@cluster0.7znimvu.mongodb.net/sidequest?retryWrites=true&w=majority&appName=Cluster0";

async function testIPv4() {
  console.log("Testing IPv4 connection to Atlas...");
  try {
    const conn = await mongoose.connect(uri, {
      family: 4, // Force IPv4
      serverSelectionTimeoutMS: 5000
    });
    console.log("🎉 SUCCESS! Connected to MongoDB Atlas over IPv4!");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ IPv4 Connection Failed:", err.message);
    process.exit(1);
  }
}

testIPv4();
