import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from '.';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  synchronize: false, //Config.NODE_ENV == 'test' || Config.NODE_ENV == 'dev',
  logging: false,
  entities: ['src/entity/*.{ts,js}'],
  migrations: ['src/migration/*.{ts,js}'],
  subscribers: [],
});
