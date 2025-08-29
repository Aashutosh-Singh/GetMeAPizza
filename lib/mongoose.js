import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("Please add MONGO_URI to your .env");
}

if (process.env.NODE_ENV === "development") {
  // Reuse connection during dev hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
