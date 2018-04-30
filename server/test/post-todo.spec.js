const request = require("supertest");
const { app } = require("../server");
const { Todo } = require("../models/todo");
const expect = require("chai").expect;

describe("POST /Todos", () => {
  const text = "Choclates3";
  const todoVals = [
    {
      text: "donutes"
    },
    {
      text: "gummy bears"
    }
  ];

  afterEach("Delete all entries in database", () => {
    return Todo.remove({})
      .then(res => {
        expect(res.ok).to.equal(1); // Empty Database
      })
  });

  it("should add an item to then assert with  a call to get items", () => {
    let postItem;
    return request(app)
      .post("/todos")
      .send({ text }) // sends a JSON post body
      .expect(200)
      .then(res => {
        postItem = res.body;
        return request(app).get("/todos");
      })
      .then(res => {
        // expect res.body which is arr of object to contain one object postItem.
        expect(res.body).to.deep.include(postItem);
      });
  });

  it("should add an item to  then assert directly in database", () => {
    const text = "Choclates3";

    return request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .then(res => {
        expect(res.body.text).to.equal(text);
        return Todo.find({text});
      })
      .then(todos => {
        expect(todos).to.have.lengthOf(1);
        expect(todos[0]).to.have.property("text", text);
      });
  });

  it("should not add an item to db when no body is sent and then assert by calling database", () => {
    return request(app)
      .post("/todos")
      .expect(400)
      .then(res => {
        expect(res.body.errors.text.message).to.equal(
          "Path `text` is required."
        );
        return Todo.find();
      })
      .then(todos => {
        expect(todos).to.have.lengthOf(0);
        //expect(todos).to.be.an("array").that.is.empty;
      });
  });
});