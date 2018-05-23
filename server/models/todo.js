const mongoose = require("mongoose");

// mongoose is an ORM so it helps
// to interact with the database.
// create a todo model.
// Mongoose provides an interface to mongodb collections. 
// u use the new operator to do this and it also creates the document instances.

const Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {
  Todo
};
