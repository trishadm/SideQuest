const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log("Environment MONGO_URI:", process.env.MONGO_URI);

async function testAtlas() {
  const urisToTest = [
    process.env.MONGO_URI,
    "mongodb+srv://trishadm02_db_user:trisha02082006@cluster0.7znimvu.mongodb.net/sidequest?retryWrites=true&w=majority",
    "mongodb+srv://trishadm02_db_user:trisha02082006@cluster0.7znimvu.mongodb.net/sidequest?ssl=true&authSource=admin"
  ];

  for (let i = 0; i < urisToTest.length; i++) {
    const uri = urisToTest[i];
    console.log(`\n--- Test #${i + 1}: ${uri} ---`);
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      console.log(`✅ SUCCESS! Connected to Atlas host: ${conn.connection.host}, db: ${conn.connection.name}`);
      await mongoose.disconnect();
      return true;
    } catch (err) {
      console.error(`❌ FAILED Test #${i + 1}:`, err.message);
      if (err.reason) console.error("Reason:", err.reason);
    }
  }
  return false;
}

testAtlas().then((success) => {
  if (!success) {
    console.log("\n⚠️ ALL MONGO_URI tests failed. Checking DNS SRV lookup directly...");
    dns.resolveSrv('_mongodb._tcp.cluster0.7znimvu.mongodb.net', (err, addresses) => {
      if (err) {
        console.error("DNS SRV Lookup failed:", err);
      } else {
        console.log("DNS SRV Lookup resolved hosts:", addresses);
      }
      process.exit(success ? 0 : 1);
    });
  } else {
    process.exit(0);
  }
});
