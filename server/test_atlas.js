const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb+srv://trishadm02_db_user:trisha02082006@cluster0.7znimvu.mongodb.net/sidequest?retryWrites=true&w=majority&appName=Cluster0";
console.log("Testing MONGO_URI:", uri);

async function testConnection() {
  const optionsList = [
    { name: "Default Atlas SSL", opts: { serverSelectionTimeoutMS: 5000 } },
    { name: "TLS Allow Invalid Certs", opts: { serverSelectionTimeoutMS: 5000, tls: true, tlsAllowInvalidCertificates: true } },
    { name: "Insecure TLS fallback", opts: { serverSelectionTimeoutMS: 5000, tlsInsecure: true } }
  ];

  for (const opt of optionsList) {
    console.log(`\nTesting: ${opt.name}...`);
    try {
      const conn = await mongoose.connect(uri, opt.opts);
      console.log(`✅ SUCCESS with [${opt.name}]! Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error(`❌ Failed with [${opt.name}]:`, err.message);
      if (err.reason && err.reason.servers) {
        for (const [host, desc] of err.reason.servers.entries()) {
          console.error(`   Server ${host}: ${desc.error ? desc.error.message : 'No error details'}`);
        }
      }
    }
  }
  process.exit(1);
}

testConnection();
