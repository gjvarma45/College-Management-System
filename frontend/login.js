const API_URL = 'http://localhost:5000';

// If already logged in, skip the login page
if (localStorage.getItem('loggedIn') === 'true') {
  window.location.href = 'index.html';
}

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', data.username);
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = data.error;
    }
  } catch (err) {
    errorMessage.textContent = 'Cannot reach the server. Is the backend running?';
  }
});