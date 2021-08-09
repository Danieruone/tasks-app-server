const express = require("express");
const Task = require("../models/task");
const bcrypt = require("bcrypt");
const _ = require("underscore");
// middlewares
const { verifyToken } = require("../middlewares/authentication");

const app = express();

app.get("/task", [verifyToken], function (req, res) {
  console.log(req.user);
  Task.find({ user_id: req.user._id }, "user_id name status").exec(
    (err, tasks) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      Task.count({ user_id: req.user._id }, (err, count) => {
        res.json({
          ok: true,
          tasks,
          numberOfTasks: count,
        });
      });
    }
  );
});

app.post("/task", function (req, res) {
  let body = req.body;

  let task = new Task({
    user_id: body.user_id,
    name: body.name,
  });

  task.save((err, taskDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      task: taskDB,
    });
  });
});

app.put("/task/:id", [verifyToken], function (req, res) {
  let id = req.params.id;
  // update this parameters
  let body = _.pick(req.body, ["name", "status"]);

  Task.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, taskDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        task: taskDB,
      });
    }
  );
});

app.delete("/task/:id", [verifyToken], function (req, res) {
  let id = req.params.id;
  Task.findByIdAndRemove(id, (err, deletedTask) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!deletedTask) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "task not found",
        },
      });
    }
    res.json({
      ok: true,
      deletedTask,
    });
  });
});

module.exports = app;
