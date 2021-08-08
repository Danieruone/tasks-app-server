const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let TaskSchema = new Schema({
  user_id: {
    type: String,
    require: [true, "user_id name is required"],
  },
  name: {
    type: String,
    require: [true, "task name is required"],
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
