const { checkSchema } = require('express-validator');

export default checkSchema({
  email: {
    errorMessage: 'Email is required',
    notEmpty: true,
  },
});
