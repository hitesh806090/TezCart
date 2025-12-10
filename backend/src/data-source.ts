import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Never use in production
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    max: 10, // Maximum pool size
    idleTimeoutMillis: 30000,
  },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
