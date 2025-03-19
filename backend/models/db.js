const mysql = require("mysql2");
require("dotenv").config();
const { Sequelize } = require('sequelize');

// Create MySQL Pool for direct queries
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "kitanshi",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pearm_tracking_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully!");
        connection.release();
    }
});

// Create Sequelize instance for ORM
const sequelize = new Sequelize(
    process.env.DB_NAME || "pearm_tracking_db",
    process.env.DB_USER || "kitanshi",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log('Sequelize connected to MySQL...'))
    .catch(err => console.error('Unable to connect to Sequelize:', err));

module.exports = { pool: pool.promise(), sequelize };
