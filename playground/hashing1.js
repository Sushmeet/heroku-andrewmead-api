const crypto = require("crypto");
const { SHA256 } = require("crypto");

const message = "I am user number 3";

const hashify = message => {
  return crypto
    .createHash("sha256")
    .update(message)
    .digest("hex");
};

const data = {
  id: 4
};

const token = {
  data,
  hash: hashify(`${data} + somesecret`)
};

// Man in the middle attack
// someone changes id and sends new hash

// token.data.id = 5;
// token.hash = hashify(JSON.stringify(token.data));

const resultHash = hashify(`${token.data} + somesecret`);

console.log(token.hash);
console.log(resultHash);

if (resultHash === token.hash) {
  console.log("Trust the hash");
} else {
  console.log("Do not trust the hash");
}
