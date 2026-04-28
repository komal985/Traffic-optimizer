const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traffic_optimizer';
const MONGODB_FALLBACK_ENABLED = process.env.MONGODB_FALLBACK_ENABLED !== 'false';
const MONGODB_FALLBACK_DB_PATH =
  process.env.MONGODB_FALLBACK_DB_PATH || path.join(__dirname, '.mongo-data');
let memoryServer = null;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    if (!MONGODB_FALLBACK_ENABLED) {
      throw error;
    }

    console.warn('⚠️ MongoDB connection failed:', error.message);
    console.log('ℹ️ Starting local fallback MongoDB (persistent) for development...');

    if (!fs.existsSync(MONGODB_FALLBACK_DB_PATH)) {
      fs.mkdirSync(MONGODB_FALLBACK_DB_PATH, { recursive: true });
    }

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'traffic_optimizer',
        dbPath: MONGODB_FALLBACK_DB_PATH,
      },
    });
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Fallback MongoDB started and connected at ${MONGODB_FALLBACK_DB_PATH}`);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = { connectDB, disconnectDB };
