const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/tactiq');
    await client.connect();
    db = client.db('tactiq');
    console.log(' MongoDB Connected');
  } catch (err) {
    console.error(' MongoDB Error:', err);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) throw new Error('Database not connected!');
  return db;
};

module.exports = { connectDB, getDB };