const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// GET all students
app.get('/students', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM students');
  res.json(rows);
});

// POST a new student
app.post('/students', async (req, res) => {
  const { name, email, roll_no } = req.body;
  const [result] = await pool.query(
    'INSERT INTO students (name, email, roll_no) VALUES (?, ?, ?)',
    [name, email, roll_no]
  );
  res.json({ id: result.insertId, name, email, roll_no });
});

// PUT update a student
app.put('/students/:id', async (req, res) => {
  try {
    const { name, email, roll_no } = req.body;
    await pool.query(
      'UPDATE students SET name=?, email=?, roll_no=? WHERE id=?',
      [name, email, roll_no, req.params.id]
    );
    res.json({ message: 'Student updated' });
  } catch (err) {
    res.status(400).json({ error: 'Email or roll number already exists' });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id=?', [req.params.id]);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete student' });
  }
});
// ---------- COURSES ----------

// GET all courses
app.get('/courses', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM courses');
  res.json(rows);
});

// POST a new course
app.post('/courses', async (req, res) => {
  const { course_name, course_code } = req.body;
  const [result] = await pool.query(
    'INSERT INTO courses (course_name, course_code) VALUES (?, ?)',
    [course_name, course_code]
  );
  res.json({ id: result.insertId, course_name, course_code });
});

// PUT update a course
app.put('/courses/:id', async (req, res) => {
  try {
    const { course_name, course_code } = req.body;
    await pool.query(
      'UPDATE courses SET course_name=?, course_code=? WHERE id=?',
      [course_name, course_code, req.params.id]
    );
    res.json({ message: 'Course updated' });
  } catch (err) {
    res.status(400).json({ error: 'Course code already exists' });
  }
});

app.delete('/courses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id=?', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete course' });
  }
});

// ---------- ENROLLMENTS ----------

// POST enroll a student in a course
app.post('/enrollments', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    );
    res.json({ id: result.insertId, student_id, course_id });
  } catch (err) {
    res.status(400).json({ error: 'Already enrolled or invalid data' });
  }
});

// GET all courses a student is enrolled in
app.get('/enrollments/:studentId', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT courses.id, courses.course_name, courses.course_code
     FROM enrollments
     JOIN courses ON enrollments.course_id = courses.id
     WHERE enrollments.student_id = ?`,
    [req.params.studentId]
  );
  res.json(rows);
});
// ---------- LOGIN ----------

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', username: rows[0].username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});