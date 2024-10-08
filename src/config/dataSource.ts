import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Artist } from '../models/Artist';
import { AccessLog } from '../models/AccessLog';
import { Track } from '../models/Track';
import { Album } from '../models/Album';
import { Favorite } from '../models/Favorite';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config(); 

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User, Artist, AccessLog, Track, Album, Favorite],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  subscribers: [],
});

export default AppDataSource;
