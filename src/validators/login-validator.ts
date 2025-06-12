const { checkSchema } = require('express-validator');

export default checkSchema({
  email: {
    errorMessage: 'Email is required',
    notEmpty: true,
    trim: true,
    isEmail: true,
  },

  password: {
    errorMessage: 'first name is required',
    notEmpty: true,
    trim: true,
  },
});
