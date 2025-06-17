import { Pool } from 'pg';
import dotenv from 'dotenv';
import { dot } from 'node:test/reporters';

dotenv.config();
export const pool = new Pool({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')

});

pool.on('connect', () => {
    console.log('Connected to the database');
});
pool.on('error', (err) => {     
    console.error('Database connection error:', err);
});