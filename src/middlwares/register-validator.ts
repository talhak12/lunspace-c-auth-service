const { checkSchema } = require('express-validator');

export default checkSchema({
  email: {
    errorMessage: 'Email is required',
    notEmpty: true,
    trim: true,
    isEmail: true,
  },

  firstName: {
    errorMessage: 'first name is required',
    notEmpty: true,
    trim: true,
  },

  password: {
    errorMessage: 'password length should be greater than 2',
    notEmpty: true,
    //isLength: { min: 5 },
  },
});
