const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose'); // needed to load the mongo db
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const { ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the TODO API');
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.status(200).send({ todos });
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  return Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({});
      }
      return res.send({ todo });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post('/todos', (req, res) => {
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

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send('Not a valid ID');
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  return Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      return res.send({ todo });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete('/todos', (req, res) => {
  Todo.remove({}).then(todos => {
    res.send({ todos });
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send('Not a valid ID');
  }

  return Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({});
      }

      return res.send({ todo });
    })
    .catch(e => {
      return res.status(400).send(e);
    });
});

// POST username
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send({ user });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// POST /users/login {email, password}

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  let userres;

  // check if user exists.
  return User.findByCredentials(body.email, body.password)
    .then((userres2) => {
      userres = userres2;
      return userres.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send({ userres });
    })
    .catch((e) => {
      res.status(404).send(e);
    });
});

// GET users
app.get('/users', (req, res) => {
  User.find().then(users => {
    res.send({ users });
  });
});

// Delete users
app.delete('/users', (req, res) => {
  User.remove({}).then(users => {
    res.send({ users });
  });
});

// try out private route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
  // const token = req.header('x-auth');

  // User.findByToken(token).then((user) => {
  //   if (!user) {
  //     return Promise.reject();
  //   }
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(401).send('No user');
  // })
});

app.listen(port, () => {
  console.log(`Started Port at ${port}`);
});

module.exports = {
  app
};
