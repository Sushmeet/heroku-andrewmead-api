const jwt = require("jsonwebtoken");

const data = {
  id: 10
};

const token = jwt.sign(data, "secret");

const decoded = jwt.verify(token, "secret");

// jwt.verify()

console.log("Token", token);
console.log("Verified and Decoded token", decoded);
