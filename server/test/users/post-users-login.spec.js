const request = require('supertest');
const { app } = require('../../server');
const expect = require('chai').expect;
const seed = require('../seed-data/seed.js');
describe('POST /users/login', () => {
  before('Seed two items in the database', async () => {
    const res = await seed.insertUsers();
    expect(res.length).to.equal(2);
  });

  after('Seed two items in the database', async () => {
    const res = await seed.deleteUsers();
    expect(res.ok).to.equal(1); // Empty Database
  });

  it('should login user and return a valid x-auth-token', async () => {
    const body = {
      email: (await seed.users())[0].email,
      id: (await seed.users())[0]._id,
      password: (await seed.users())[0].clearTxtpassword
    };
    const res = await request(app)
      .post('/users/login')
      .send(body)
      .expect(200);

    expect(res.body.userres.email).to.equal(body.email);
    expect(res.body.userres._id).to.equal(body.id.toString());
    expect(res.headers['x-auth']).to.not.be.empty;
  });
});
