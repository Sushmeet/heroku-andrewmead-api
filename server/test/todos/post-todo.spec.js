const request = require("supertest");
const expect = require("chai").expect;

const { Todo } = require("../../models/todo");
const { app } = require("../../server");

describe("POST /Todos", () => {
  const text = "Choclates3";

  afterEach("Delete all entries in database", () => {
    return Todo.remove({}).then(res => {
      expect(res.ok).to.equal(1); // Empty Database
    });
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
        expect(res.body.todos[0]).to.deep.equal(postItem.todos);
      });
  });

  it("should add an item and assert directly in database", () => {
    return request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .then(res => {
        expect(res.body.todos.text).to.equal(text);
        return Todo.find({ text });
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
