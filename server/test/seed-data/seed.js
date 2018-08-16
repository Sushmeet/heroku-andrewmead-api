const expect  = require('chai').expect;
const { ObjectID } = require('mongodb');

const { Todo } = require('../../models/todo');

const todoVals = [
  {
    _id: new ObjectID(),
    text: 'donutes',
  },
  {
    _id: new ObjectID(),
    text: 'gummy bears',
  },
];

// const insertTodos = () => Todo.insertMany(todoVals).then((res) => {});
const insertTodos = async() => await Todo.insertMany(todoVals);

const deleteTodos = async() => await Todo.remove({});


// const deleteTodos = () => Todo.remove({}).then((res) => {
//   expect(res.ok).to.equal(1);
//   return res
// });

module.exports = {
  todoVals,
  insertTodos,
  deleteTodos
};
