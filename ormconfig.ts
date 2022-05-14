import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  database: 'voucher2',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*.js'],
  cli: { migrationsDir: 'src/database/migrations' },
  synchronize: true,
};

export default config;
