const request = require("supertest");
const expect = require("chai").expect;

const { ObjectID } = require("mongodb");
const { Todo } = require("../models/todo");
const { app } = require("../server");

describe("GET /todos/id", () => {
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

  it("should return todo document", async () => {
    const res = await request(app)
      .get(`/todos/${todoVals[0]._id.toHexString()}`)
      .expect(200);

    expect(res.body.todo.text).to.equal(todoVals[0].text);
  });

  it("should return a 404 for non object ids", async () => {
    const id = "invalidID";

    const res = await request(app)
      .get(`/todos/${id}`)
      .expect(404);

    expect(res.body).to.be.empty;
  });

  it("should return a 404 when id does not exist", async () => {
    const hexId = new ObjectID().toHexString();

    const res = await request(app)
      .get(`/todos/${hexId}`)
      .expect(404);

      expect(res.body).to.be.empty;
  });
});
