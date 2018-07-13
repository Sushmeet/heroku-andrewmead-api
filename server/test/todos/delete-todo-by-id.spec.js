const request = require("supertest");
const expect = require("chai").expect;

const { ObjectId } = require("mongodb");
const { Todo } = require("../../models/todo");
const { app } = require("../../server");

describe("DELETE /todo", () => {
  const todoVals = [
    {
      _id: new ObjectId(),
      text: "donutes"
    },
    {
      _id: new ObjectId(),
      text: "gummy bears"
    }
  ];

  beforeEach("Seed two items in the database", () => {
    Todo.insertMany(todoVals).then(res => {});
  });

  afterEach("delete all items in database", () => {
    Todo.remove({}).then(res => {
      expect(res.ok).to.equal(1); // Empty Database
    });
  });

  it("should clear all items in the database ", () => {
    return request(app)
      .delete("/todos")
      .expect(200)
      .then(res => {
        expect(res.body.todos.n).to.equal(2);
      });
  });

  it("should delete only the item by ID", () => {
    const hexId = todoVals[0]._id.toHexString();
    return request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .then(res => {
        expect(res.body.todo._id).to.equal(hexId);
        expect(res.body.todo.text).to.equal(todoVals[0].text);
        return Todo.findById(hexId);
      })
      .then(res => {
        expect(res).to.be.a("null");
      });
  });

  it("should return 404 when if todo item not found", () => {
    const someId = new ObjectId();
    return request(app)
      .delete(`/todos/${someId}`)
      .expect(404)
      .then(res => {
        expect(res.body).to.be.empty;
      });
  });

  it("should return 404 if object id is invalid", () => {
    return request(app)
      .delete(`/todos/someId`)
      .expect(404)
      .then(res => {
        expect(res.body).to.be.empty;
      });
  });
});
