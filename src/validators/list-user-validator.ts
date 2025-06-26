const { checkSchema } = require('express-validator');

export default checkSchema(
  {
    currentPage: {
      customSanitizer: {
        options: (value: string) => {
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue) ? 1 : parsedValue;
        },
      },
    },
    perPage: {
      customSanitizer: {
        options: (value: string) => {
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue) ? 1 : parsedValue;
        },
      },
    },
  },
  ['headers', 'query']
);
