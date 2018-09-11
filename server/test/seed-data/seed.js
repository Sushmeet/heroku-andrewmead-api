const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const todoVals = [
  {
    _id: new ObjectID(),
    text: 'donutes'
  },
  {
    _id: new ObjectID(),
    text: 'gummy bears'
  }
];

const userOneID = new ObjectID();
const userTwoID = new ObjectID();


const users = [
  {
    _id: userOneID,
    email: 'sushi@gmail.com',
    password: 'blah',
    token: [
      {
        access: 'auth',
        jwt: jwt.sign({ _id: userOneID, access: 'auth' }, 'secretValue').toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: 'sushi23232@gmail.com',
    password: 'blah'
  }
];
// const insertTodos = () => Todo.insertMany(todoVals).then((res) => {});
const insertTodos = async () => Todo.insertMany(todoVals);

const deleteTodos = async () => Todo.remove({});


module.exports = {
  todoVals,
  insertTodos,
  deleteTodos
};
