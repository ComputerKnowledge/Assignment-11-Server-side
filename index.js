require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// BASIC SERVER CONFIGURATION
// app.get("/", (req, res) => {
//   console.log("hello world");
//   res.send({ message: "Don't worry it fine to get error" });
// });

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
    const database2 = client.db("Assignment-11").collection("submission");
    // API to get all assignments
    app.get("/assignments", async (req, res) => {
      const result = await database1.find().toArray();
      res.send(result);
    });
    // API to post a single assignment
    app.post("/assignments", async (req, res) => {
      const data = req.body;
      const result = await database1.insertOne(data);
      res.send(result);
    });
    // API to get a single assignment
    app.get("/assignments/:id", async (req, res) => {
      const { id } = req.params;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await database1.findOne(query);
      res.send(result);
    });
    //  API  to delete a single assignment
    app.delete("/assignments/:id", async (req, res) => {
      const { id } = req.params;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await database1.deleteOne(query);
      res.send(result);
    });
    // API to update a single assignment
    app.put("/assignments/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const filter = {
        _id: new ObjectId(id),
      };
      const option = {
        upsert: true,
      };
      const updatedData = {
        $set: {
          assignmentTitle: data.assignmentTitle,
          assignmentDescription: data.assignmentDescription,
          totalMarks: data.totalMarks,
          thumbnail: data.thumbnail,
          difficultyLevel: data.difficultyLevel,
          dueDate: data.dueDate,
          createdBy: data.createdBy,
        },
      };
      // console.log("hello world");
      const result = await database1.updateOne(filter, updatedData, option);
      res.send(result);
    });
    // API to post assignment submission
    app.post("/assignmentSubmit", async (req, res) => {
      const data = req.body;
      const result = await database2.insertOne(data);
      res.send(result);
    });
    // APT   to get all submission
    app.get("/assignmentSubmit", async (req, res) => {
      const result = await database2.find({ status: "pending" }).toArray();
      res.send(result);
    });
    // API  to get data based on user's email
    app.get("/assignmentSubmit/:email", async (req, res) => {
      const { email } = req.params;
      const query = {
        takingUser: email,
      };
      const result = await database2.find(query).toArray();
      res.send(result);
    });
    // API to update and assignment submission
    app.put("/assignmentSubmit/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const filter = {
        _id: new ObjectId(id),
      };
      const option = {
        upsert: true,
      };
      // console.log("hello world");
      const updatedData = {
        $set: {
          feedback: data.feedback,
          mark: data.mark,
          status: data.status,
        },
      };
      const result = await database2.updateOne(filter, updatedData, option);
      res.send(result);
    });
  } finally {
    // DO SOMETHING
  }
}
run().catch(console.dir);

app.listen(port);
