const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // here author is one of the field in taskSchema
    // so no need of virtual entity to get the user data
    // instead using "ref" property and assigning the other's collection name(User) as value
    // connects the two collections
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // ref is used relate with two collections(User,task) and get the data
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;
