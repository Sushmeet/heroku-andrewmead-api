const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  const todo = new Todo({ text: req.body.text });

  todo.save().then(
    doc => {
      res.status(200).send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos", (req, res) => {
  // callback style
  // Todo.find((err, todos) => {
  //   if (err) return console.error(err);
  //   console.log('Get request', todos);
  //   res.status(200).send(todos);
  // })
  // console.log("URL", req.url);
  // console.log("Body", req.body);
  // console.log("Route", req.route);


  Todo.find().then(todos => {
    res.status(200).send(todos);
  });
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  } else {
    Todo.findById(id)
      .then(todo => {
        if (!todo) {
          return res.status(404).send({});
        }
        res.send({ todo });
      })
      .catch(e => {
        res.status(400).send()
      });
  }
});

app.get("/", (req, res) => {
  res.send("hello09");
});

app.listen(port, () => {
  console.log(`Started Port at ${port}`);
});

module.exports = {
  app
};
