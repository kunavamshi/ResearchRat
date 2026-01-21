const db = require('./db');

(async () => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    console.log('Users:', users);
    const [expenses] = await db.query('SELECT * FROM expenses');
    console.log('Expenses:', expenses);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
