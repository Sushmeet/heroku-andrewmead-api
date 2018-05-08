const request = require("supertest");
const { app } = require("../server");
const { User } = require("../models/user");
const expect = require("chai").expect;

describe("POST /Users", () => {
  const body = {
    email: "sushi2@example.com",
    password: "123456"
  };

  afterEach("Delete all entries in database", () => {
    return User.remove({}).then(res => {
      expect(res.ok).to.equal(1); // Empty Database
    });
  });

  xit("should add an item to then assert with  a call to get items", () => {
    let postItem;
    return request(app)
      .post("/users")
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
      .post("/users")
      .send(body)
      .expect(200)
      .then(res => {
        expect(res.body.user.email).to.equal(body.email);
        return User.find({ email: body.email });
      })
      .then(user => {
        // console.log('DB User', JSON.stringify(user, undefined, 2));
        expect(user).to.have.lengthOf(1);
        expect(user[0]).to.have.property("email", body.email);
        expect(user[0].tokens[0]).to.have.property("token");
      });
  });

  it("should not add an item to db when no body is sent and then assert by calling database", () => {
    return request(app)
      .post("/users")
      .expect(400)
      .then(res => {
        expect(res.body.errors.email.message).to.equal(
          "Path `email` is required."
        );
        return User.find();
      })
      .then(user => {
        expect(user).to.have.lengthOf(0);
      });
  });
});
