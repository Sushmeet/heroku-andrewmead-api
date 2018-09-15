const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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


const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};


const users = async () => {
  return [
    {
      _id: userOneID,
      email: 'sushi@gmail.com',
      password: await hashedPassword('password12'),
      clearTxtpassword: 'password12',
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
      password: await hashedPassword('password1234')
    }
  ];
};


// const insertTodos = () => Todo.insertMany(todoVals).then((res) => {});
const insertTodos = async () => Todo.insertMany(todoVals);

const deleteTodos = async () => Todo.remove({});

const insertUsers = async () => User.insertMany(await users());

const deleteUsers = async () => User.remove({});


module.exports = {
  todoVals,
  users,
  insertTodos,
  insertUsers,
  deleteTodos,
  deleteUsers
};
