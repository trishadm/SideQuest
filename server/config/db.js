const mongoose = require('mongoose');
const path = require('path');

// Redirect MongoMemoryServer download directory to cache folder for local development
process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '../.mongo_cache');

let isConnected = false;

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER;
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://trishadm02_db_user:trisha02082006@cluster0.7znimvu.mongodb.net/sidequest?retryWrites=true&w=majority&appName=Cluster0';

  console.log(`🔌 Initializing Database Connection...`);
  console.log(`📌 Target Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`📌 MONGO_URI Target: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    isConnected = true;
    console.log(`⚡ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database Name: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState} (Connected)`);

    // Auto-seed initial data if collection is empty
    const seedData = require('../utils/seedData');
    await seedData({ exitProcess: false });
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.error(`🔍 Diagnostic Details:`);
    if (error.reason && error.reason.servers) {
      for (const [host, desc] of error.reason.servers.entries()) {
        console.error(`   - Server (${host}): ${desc.error ? desc.error.message : 'No detailed error string'}`);
      }
    }
    console.error(`💡 Common Resolution: Ensure your current IP address (or 0.0.0.0/0) is whitelisted in MongoDB Atlas Security -> Network Access.`);

    if (isProduction) {
      console.error(`🚨 PRODUCTION DATABASE FAILURE: Fallback MongoMemoryServer is disabled in production.`);
      console.error(`👉 Please verify MONGO_URI on your Render Dashboard and ensure MongoDB Atlas IP Whitelist allows 0.0.0.0/0.`);
      return;
    }

    // In local development mode ONLY, attempt MongoMemoryServer fallback for offline testing
    try {
      console.log(`🚀 [DEV ONLY] Attempting MongoMemoryServer local instance as fallback for dev testing...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const fs = require('fs');

      const instanceDbPath = path.join(__dirname, '../.mongo_cache/db_instance');
      if (fs.existsSync(instanceDbPath)) {
        try {
          fs.rmSync(instanceDbPath, { recursive: true, force: true });
        } catch (e) {}
      }
      fs.mkdirSync(instanceDbPath, { recursive: true });

      if (!global.__MONGO_SERVER__) {
        try {
          global.__MONGO_SERVER__ = await MongoMemoryServer.create({
            instance: { dbPath: instanceDbPath }
          });
        } catch (err) {
          console.warn(`⚠️ Clean instance path start failed, retrying in-memory: ${err.message}`);
          global.__MONGO_SERVER__ = await MongoMemoryServer.create();
        }
      }

      const fallbackUri = global.__MONGO_SERVER__.getUri();
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 10000,
        heartbeatFrequencyMS: 2000
      });
      isConnected = true;
      console.log(`⚡ Fallback MongoDB Connected (In-Memory Dev): ${conn.connection.host}`);

      const seedData = require('../utils/seedData');
      await seedData({ exitProcess: false, force: true });
    } catch (memError) {
      console.error(`❌ In-memory fallback also failed: ${memError.message}`);
    }
  }
};

module.exports = connectDB;


