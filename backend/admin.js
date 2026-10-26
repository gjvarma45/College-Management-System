const bcrypt = require('bcryptjs');
const pool = require('./db');

async function createAdmin() {
  const username = 'admin';
  const password = 'admin123'; // change this to your own password

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash]
  );

  console.log('Admin user created');
  process.exit();
}

createAdmin();