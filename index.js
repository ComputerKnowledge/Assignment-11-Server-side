require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express());

app.get("/", (req, res) => {
  res.send(
    "hello world! At last I have been able to submit the Assignment 10 and 11 is running here. I will submit it within a week and make as many requirement full filled."
  );
});

app.listen(port);
