require('dotenv').config();
const db = require('./db');

console.log('Testing database connection...');
console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

(async () => {
    try {
        const [result] = await db.query('SELECT 1 as test');
        console.log('Database connection successful:', result);
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
})();
