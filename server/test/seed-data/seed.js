const { ObjectID } = require('mongodb');

const { Todo } = require('../../models/todo');

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

// const insertTodos = () => Todo.insertMany(todoVals).then((res) => {});
const insertTodos = async () => Todo.insertMany(todoVals);

const deleteTodos = async () => Todo.remove({});

module.exports = {
  todoVals,
  insertTodos,
  deleteTodos
};
