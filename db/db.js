require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;

const dbName = process.env.DB_NAME;

let dbInstance;

async function connectDB() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    console.log("Connected to MongoDB");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

function getDB() {
  if (!dbInstance) {
    throw new Error("DB not initialized. Call connectDB first.");
  }
  return dbInstance;
}

module.exports = { connectDB, getDB };
