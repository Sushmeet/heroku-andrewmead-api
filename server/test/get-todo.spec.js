const request = require("supertest");
const expect = require("chai").expect;

const { Todo } = require("../models/todo");
const { app } = require("../server");

describe("GET /todo", () => {
  const todoVals = [
    {
      text: "donutes"
    },
    {
      text: "gummy bears"
    }
  ];

  beforeEach("Seed two items in the database", () => {
    Todo.insertMany(todoVals).then(res => {
    });
  });

  afterEach("delete all items in database", () => {
    Todo.remove().then(res => {
      expect(res.ok).to.equal(1); // Empty Database
    });
  });

  it('should return 2 items on the ', () => {
    return request(app)
        .get('/todos')
        .expect(200)
        .then((res) => {
        expect(res.body).to.have.lengthOf(2);
        })
  })
});
