module.exports = {
    "extends": "airbnb/legacy",
    "env": {
      "mocha": true
    },
    "rules": {
      "func-names": 0,
      "max-len": ["error", 200],
      "no-unused-expressions": 0
    },
    "parserOptions": {
      "ecmaVersion": 2017,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true,
        "experimentalObjectRestSpread": true,
      }
  }
};