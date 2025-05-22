import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect(err => {
    if (err) {
        console.log("error while connecting the database", err)
    } else {
        console.log("DB Connected successfully.")
    }
})


// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

export default db;


// db.js
import mysqlpromise from 'mysql2';

const connection = mysqlpromise.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const dbs = connection.promise(); // <-- enables promise-based queries
export {dbs};
