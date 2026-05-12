/**
 * auth.js - Login and Signup logic
 *
 * Handles form validation, API calls, and feedback.
 */

// ============================================================
// TOGGLE BETWEEN LOGIN AND SIGNUP FORMS
// ============================================================

function toggleForms() {
  const loginSection  = document.getElementById('loginSection');
  const signupSection = document.getElementById('signupSection');

  if (loginSection.style.display === 'none') {
    // Show login, hide signup
    loginSection.style.display  = 'block';
    signupSection.style.display = 'none';
    clearErrors();
  } else {
    // Show signup, hide login
    loginSection.style.display  = 'none';
    signupSection.style.display = 'block';
    clearErrors();
  }
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
  const loginErr  = document.getElementById('loginServerErr');
  const signupErr = document.getElementById('signupServerErr');
  if (loginErr)  { loginErr.style.display  = 'none'; loginErr.textContent  = ''; }
  if (signupErr) { signupErr.style.display = 'none'; signupErr.textContent = ''; }
}

// ============================================================
// LOGIN HANDLER
// ============================================================

async function handleLogin() {
  clearErrors();
  let valid = true;

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  // Validate username
  if (!username) {
    setError('loginUsername', 'loginUsernameErr', 'Username is required.');
    valid = false;
  }

  // Validate password
  if (!password) {
    setError('loginPassword', 'loginPasswordErr', 'Password is required.');
    valid = false;
  }

  if (!valid) return;

  // Call API
  try {
    const result = await AuthAPI.login(username, password);

    if (result.success) {
      // Save username in sessionStorage (simple auth, not production-grade)
      sessionStorage.setItem('loggedInUser', result.username);
      showToast(`Welcome back, ${result.username}!`, 'success');

      // Redirect to homepage after short delay
      setTimeout(() => window.location.href = 'index.html', 1200);
    } else {
      showServerError('loginServerErr', result.message);
    }
  } catch (err) {
    showServerError('loginServerErr', 'Login failed. Please check your credentials.');
  }
}

// ============================================================
// SIGNUP HANDLER
// ============================================================

async function handleSignup() {
  clearErrors();
  let valid = true;

  const username = document.getElementById('signupUsername').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  // Validate username
  if (!username || username.length < 3) {
    setError('signupUsername', 'signupUsernameErr', 'Username must be at least 3 characters.');
    valid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    setError('signupEmail', 'signupEmailErr', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate password
  if (!password || password.length < 6) {
    setError('signupPassword', 'signupPasswordErr', 'Password must be at least 6 characters.');
    valid = false;
  }

  if (!valid) return;

  try {
    const result = await AuthAPI.signup(username, email, password);

    if (result.success) {
      showToast('Account created! Please log in.', 'success');
      setTimeout(() => toggleForms(), 1200);
    } else {
      showServerError('signupServerErr', result.message);
    }
  } catch (err) {
    showServerError('signupServerErr', 'Signup failed. Please try again.');
  }
}

// ============================================================
// HELPERS
// ============================================================

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (error) error.textContent = message;
}

function showServerError(errorDivId, message) {
  const div = document.getElementById(errorDivId);
  if (div) {
    div.textContent = '⚠️ ' + message;
    div.style.display = 'block';
  }
}

// Allow Enter key in form fields
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const loginVisible  = document.getElementById('loginSection').style.display !== 'none';
      if (loginVisible) handleLogin();
      else              handleSignup();
    }
  });
});
