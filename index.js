require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express());

// BASIC SERVER CONFIGURATION
app.get("/", (req, res) => {
  console.log("hello world");
  res.send({ message: "Don't worry it fine to get error" });
});

// DATABASE CONFIGURATION
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zuqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database1 = client.db("Assignment-11").collection("assignment");
    app.get("/error", (req, res) => {
      res.send("Don't worry it fine to get error");
    });
  } finally {
    // DO SOMETHING
  }
}
run().catch(console.dir);

app.listen(port);
