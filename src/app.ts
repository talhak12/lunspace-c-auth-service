import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';

import createHttpError, { HttpError } from 'http-errors';
import path from 'path';

const app = express();

app.use(express.static('public'));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res, next) => {
  res.status(200).send('pop');
});

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

//global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  //console.log(err);
  //logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: '',
        location: '',
      },
    ],
  });
});

export default app;
