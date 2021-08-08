require("./config/config");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use(require("./routes/index"));

// database
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;
    console.log("Database connected");
  }
);

// starting the server
app.listen(process.env.PORT, () =>
  console.log(`Listening port ${process.env.PORT}`)
);
