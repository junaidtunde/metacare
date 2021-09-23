import { createConnection } from 'typeorm';

import Comments from "../entity/Comments";

require('dotenv').config();

export const connection = createConnection({
    type: 'postgres', 
    // host: process.env.PGHOST,
    // port:  Number(process.env.PGPORT), // default port of postgres
    // username: process.env.PGUSER, // our created username, you can have your own user name
    // password: process.env.PGPASSWORD, // our created username, you can have your own password
    // database: process.env.PGDATABASE, // our created database name, you can have your own
    url: process.env.DATABASE_URL,
    entities: [
        // typeORM will not be able to create database table if we forget to put entity class name here..
        Comments
    ],
    synchronize: true,
    logging: false,
    ssl: true
});