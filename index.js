require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://assignment-11-31fe7.web.app",
      "https://assignment-11-31fe7.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unAuthorized" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unAuthorized" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Assignment 11");
});

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

    // jwt authentication api
    app.post("/jwt", (req, res) => {
      const user = req.body;
      // console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "5h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // jwt token removal api
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

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
    app.get("/assignments/:id", verifyToken, async (req, res) => {
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
    app.get("/assignmentSubmit", verifyToken, async (req, res) => {
      const result = await database2.find({ status: "pending" }).toArray();
      res.send(result);
    });
    // API  to get data based on user's email
    app.get("/assignmentSubmit/:email", verifyToken, async (req, res) => {
      const { email } = req.params;
      // console.log(req.cookies?.token);
      if (req.user.email !== email) {
        return res.status(403).send({ message: "forbidden" });
      }
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
