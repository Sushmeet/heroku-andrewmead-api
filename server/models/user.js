const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// instance method
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access }, 'secretValue').toString();
  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

// model method (NOT instance methods)
userSchema.statics.findByToken = function (token) {
  const user = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'secretValue');
  } catch (e) {
    return Promise.reject();
  }

  return user.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  const user = this;

  return user
    .findOne({
      email
    })
    .then(userFoound => {
      if (!userFoound) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, userFoound.password, (err, res) => {
          if (res) {
            resolve(userFoound);
          } else {
            reject(err);
          }
        });
      });
    });
};

userSchema.pre('save', async function (next) {
  let user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    next();
  } else {
    next();
  }
});

// to use the schema definition
// we convert our blogSchema into a Model we can work with.
const User = mongoose.model('User', userSchema);

module.exports = { User };
