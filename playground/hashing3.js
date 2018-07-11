const bcrypt = require("bcryptjs");

const password = "123abc!";

// return bcrypt
//   .genSalt(10)
//   .then(salt => {
//     // console.log(salt);
//     return bcrypt.hash(password, salt);
//   })
//   .then(hash => {
//     console.log(hash);
//   });

const hashedPassword = '$2a$10$/38/ESeTQBkO7gsHpWEKF.0UEfWQbCcpUqIvDGFnYvNtqXT1bnhzG';

return bcrypt.compare(password, hashedPassword).then(res => {
  console.log(res);
});
