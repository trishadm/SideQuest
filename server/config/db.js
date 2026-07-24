const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');

// Set public DNS resolvers to ensure Node resolves MongoDB Atlas SRV records correctly
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('⚠️ Unable to set custom DNS servers:', e.message);
}

// Redirect MongoMemoryServer download directory to E: drive to prevent C: drive ENOSPC disk full errors
process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '../.mongo_cache');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://trishadm02_db_user:trisha02082006@cluster0.7znimvu.mongodb.net/sidequest?retryWrites=true&w=majority&appName=Cluster0';

  console.log(`🔌 Initializing Database Connection...`);
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

    // If Atlas connection fails, attempt MongoMemoryServer so application stays functional
    try {
      console.log(`🚀 Attempting MongoMemoryServer local instance as fallback for dev testing...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const fs = require('fs');

      const instanceDbPath = path.join(__dirname, '../.mongo_cache/db_instance');
      if (!fs.existsSync(instanceDbPath)) {
        fs.mkdirSync(instanceDbPath, { recursive: true });
      }

      if (!global.__MONGO_SERVER__) {
        global.__MONGO_SERVER__ = await MongoMemoryServer.create({
          instance: { dbPath: instanceDbPath }
        });
      }

      const fallbackUri = global.__MONGO_SERVER__.getUri();
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 10000,
        heartbeatFrequencyMS: 2000
      });
      isConnected = true;
      console.log(`⚡ Fallback MongoDB Connected (In-Memory): ${conn.connection.host}`);

      const seedData = require('../utils/seedData');
      await seedData({ exitProcess: false, force: true });
    } catch (memError) {
      console.error(`❌ In-memory fallback also failed: ${memError.message}`);
    }
  }
};

module.exports = connectDB;


