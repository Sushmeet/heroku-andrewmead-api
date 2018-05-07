const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { ObjectId } = require("mongodb");


const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send("Not a valid ID");
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete("/todos", (req, res) => {
  Todo.remove({}).then(todos => {
    res.send({ todos });
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send("Not a valid ID");
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({});
      }

      res.send({ todo });
    })
    .catch(e => {
      return res.status(400).send(e);
    });
});

app.post("/todos", (req, res) => {
  const todo = new Todo({ text: req.body.text });

  todo.save().then(
    todos => {
      res.status(200).send({ todos });
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
    res.status(200).send({ todos });
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
        res.status(400).send();
      });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the TODO API");
});

// POST username
app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User(body);

  user.save()
    .then((user) => {
       return user.generateAuthToken();
    })
    .then((token) => {
       res.header('x-auth', token).send({ user });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log(`Started Port at ${port}`);
});

module.exports = {
  app
};
