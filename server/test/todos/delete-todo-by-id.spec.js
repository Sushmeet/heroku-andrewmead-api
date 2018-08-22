const request = require('supertest');
const expect = require('chai').expect;

const { ObjectId } = require('mongodb');
const { Todo } = require('../../models/todo');
const { app } = require('../../server');
const { todoVals, insertTodos, deleteTodos } = require('../seed-data/seed.js');

describe('DELETE /todo', () => {
  beforeEach('Seed two items in the database', async () => {
    const res = await insertTodos();
    // const res = await Todo.insertMany(todoVals); //when i did this with a  then statement and empty inside done was needed.
    expect(res.length).to.equal(2);
  });

  afterEach('delete all items in database', async () => {
    const res = await deleteTodos();
    expect(res.ok).to.equal(1); // Empty Database
  });

  it('should clear all items in the database ', () => request(app)
    .delete('/todos')
    .expect(200)
    .then((res) => {
      expect(res.body.todos.n).to.equal(2);
    }));

  it('should delete only the item by ID', () => {
    const hexId = todoVals[0]._id.toHexString();
    return request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .then((res) => {
        expect(res.body.todo._id).to.equal(hexId);
        expect(res.body.todo.text).to.equal(todoVals[0].text);
        return Todo.findById(hexId);
      })
      .then((res) => {
        expect(res).to.be.a('null');
      });
  });

  it('should return 404 when if todo item not found', () => {
    const someId = new ObjectId();
    return request(app)
      .delete(`/todos/${someId}`)
      .expect(404)
      .then((res) => {
        expect(res.body).to.be.empty;
      });
  });

  it('should return 404 if object id is invalid', () => request(app)
    .delete('/todos/someId')
    .expect(404)
    .then((res) => {
      expect(res.body).to.be.empty;
    }));
});
