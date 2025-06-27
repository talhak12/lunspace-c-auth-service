const { checkSchema } = require('express-validator');

export default checkSchema(
  {
    q: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : '';
        },
      },
    },
    role: {
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : '';
        },
      },
    },
    currentPage: {
      customSanitizer: {
        options: (value: string) => {
          const parsedValue = Number(value);
          console.log('parsedValue', parsedValue);
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
