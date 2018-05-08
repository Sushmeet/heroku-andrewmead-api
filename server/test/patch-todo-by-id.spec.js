const request = require("supertest");
const expect = require("chai").expect;

const { ObjectID } = require("mongodb");
const { Todo } = require("../models/todo");
const { app } = require("../server");

describe("PATCH /todos/id", () => {
  const todoVals = [
    {
      _id: new ObjectID(),
      text: "donutes"
    },
    {
      _id: new ObjectID(),
      text: "gummy bears"
    }
  ];

  beforeEach(() => {
    Todo.insertMany(todoVals).then(res => {});
  });

  afterEach(() => {
    Todo.remove({}).then(res => {
      expect(res.ok).to.equal(1);
    });
  });

  it("should update the todo", async () => {
    const body = {
      completed: true,
      text: "Hababa"
    };

    const hexId = todoVals[0]._id.toHexString();
    const res = await request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200);

    expect(res.body.todo.completed).to.be.true;
    expect(res.body.todo.completedAt).to.be.a("number");
    expect(res.body.todo.text).to.equal(body.text);
  });

  it("should clear completedAt when todo is not completed", async () => {
    const body = {
      completed: false,
      text: "juryyyyyy"
    };

    const hexId = todoVals[1]._id.toHexString();
    const res = await request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200);

    expect(res.body.todo.completed).to.be.false;
    expect(res.body.todo.completedAt).to.be.a("null");
    expect(res.body.todo.text).to.equal(body.text);
  });
});
