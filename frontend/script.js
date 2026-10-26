// Redirect to login if not logged in
if (localStorage.getItem('loggedIn') !== 'true') {
  window.location.href = 'login.html';
}

function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

const API_URL = 'http://localhost:5000';

const studentForm = document.getElementById('student-form');
const courseForm = document.getElementById('course-form');
const enrollForm = document.getElementById('enroll-form');

const studentTable = document.getElementById('student-table');
const courseTable = document.getElementById('course-table');
const studentSelect = document.getElementById('student-select');
const courseSelect = document.getElementById('course-select');

// Helper: create a button with a click handler
function makeButton(label, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener('click', onClick);
  return btn;
}

// ---------- STUDENTS ----------

async function loadStudents() {
  const response = await fetch(`${API_URL}/students`);
  const students = await response.json();

  const enrollments = await Promise.all(
    students.map(s =>
      fetch(`${API_URL}/enrollments/${s.id}`).then(r => r.json())
    )
  );

  studentTable.innerHTML = '';
  studentSelect.innerHTML = '<option value="">Select student</option>';

  students.forEach((student, index) => {
    const courseNames = enrollments[index]
      .map(c => c.course_name)
      .join(', ') || 'None';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.roll_no}</td>
      <td>${courseNames}</td>
    `;

    const actions = document.createElement('td');
    actions.appendChild(makeButton('Edit', 'edit-btn', () => editStudent(student)));
    actions.appendChild(makeButton('Delete', 'delete-btn', () => deleteStudent(student)));
    row.appendChild(actions);

    studentTable.appendChild(row);

    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = `${student.name} (${student.roll_no})`;
    studentSelect.appendChild(option);
  });
}

async function editStudent(student) {
  const name = prompt('Name:', student.name);
  if (name === null) return; // user pressed Cancel
  const email = prompt('Email:', student.email);
  if (email === null) return;
  const roll_no = prompt('Roll No:', student.roll_no);
  if (roll_no === null) return;

  const response = await fetch(`${API_URL}/students/${student.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, roll_no })
  });

  if (!response.ok) {
    const data = await response.json();
    alert(data.error);
    return;
  }
  loadStudents();
}

async function deleteStudent(student) {
  if (!confirm(`Delete ${student.name}? Their enrollments will also be removed.`)) return;

  await fetch(`${API_URL}/students/${student.id}`, { method: 'DELETE' });
  loadStudents();
}

studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    roll_no: document.getElementById('roll_no').value
  };

  await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });

  studentForm.reset();
  loadStudents();
});

// ---------- COURSES ----------

async function loadCourses() {
  const response = await fetch(`${API_URL}/courses`);
  const courses = await response.json();

  courseTable.innerHTML = '';
  courseSelect.innerHTML = '<option value="">Select course</option>';

  courses.forEach(course => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${course.id}</td>
      <td>${course.course_name}</td>
      <td>${course.course_code}</td>
    `;

    const actions = document.createElement('td');
    actions.appendChild(makeButton('Edit', 'edit-btn', () => editCourse(course)));
    actions.appendChild(makeButton('Delete', 'delete-btn', () => deleteCourse(course)));
    row.appendChild(actions);

    courseTable.appendChild(row);

    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = `${course.course_name} (${course.course_code})`;
    courseSelect.appendChild(option);
  });
}

async function editCourse(course) {
  const course_name = prompt('Course Name:', course.course_name);
  if (course_name === null) return;
  const course_code = prompt('Course Code:', course.course_code);
  if (course_code === null) return;

  const response = await fetch(`${API_URL}/courses/${course.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_name, course_code })
  });

  if (!response.ok) {
    const data = await response.json();
    alert(data.error);
    return;
  }
  loadCourses();
  loadStudents(); // refresh enrolled course names too
}

async function deleteCourse(course) {
  if (!confirm(`Delete ${course.course_name}? Student enrollments in it will also be removed.`)) return;

  await fetch(`${API_URL}/courses/${course.id}`, { method: 'DELETE' });
  loadCourses();
  loadStudents();
}

courseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const course = {
    course_name: document.getElementById('course_name').value,
    course_code: document.getElementById('course_code').value
  };

  await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });

  courseForm.reset();
  loadCourses();
});

// ---------- ENROLLMENTS ----------

enrollForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const enrollment = {
    student_id: studentSelect.value,
    course_id: courseSelect.value
  };

  const response = await fetch(`${API_URL}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enrollment)
  });

  if (!response.ok) {
    const data = await response.json();
    alert(data.error);
    return;
  }
  loadStudents();
});

// Load everything when the page opens
loadStudents();
loadCourses();