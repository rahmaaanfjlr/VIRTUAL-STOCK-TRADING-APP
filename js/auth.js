function signupUser(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!username || !email || !password || !confirmPassword) {
    showToast('All fields are required', 'error');
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid email', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.username === username)) {
    showToast('Username already taken', 'error');
    return;
  }
  if (users.some(u => u.email === email)) {
    showToast('Email already registered', 'error');
    return;
  }

  const newUser = {
    id: 'USER_' + Date.now(),
    username,
    email,
    password,
    balance: 100000,
    portfolio: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  showToast('Account created successfully! Please login.', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
}

function loginUser(e) {
  e.preventDefault();
  const identifier = document.getElementById('identifier').value.trim();
  const password = document.getElementById('password').value;

  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);

  if (!user) {
    showToast('Invalid username/email or password', 'error');
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  showToast('Login successful!', 'success');
  setTimeout(() => {
    window.location.href = 'user-dashboard.html';
  }, 1000);
}

function loginAdmin(e) {
  e.preventDefault();
  const username = document.getElementById('adminUser').value.trim();
  const password = document.getElementById('adminPass').value;
  const adminAccount = JSON.parse(localStorage.getItem('adminAccount'));

  if (username === adminAccount.username && password === adminAccount.password) {
    localStorage.setItem('currentAdmin', JSON.stringify({ username }));
    showToast('Admin login successful!', 'success');
    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 1000);
  } else {
    showToast('Invalid admin credentials', 'error');
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentAdmin');
  window.location.href = 'login.html';
}

function checkAuth() {
  const path = window.location.pathname;
  if (path.includes('admin-') && path !== 'admin-login.html') {
    if (!localStorage.getItem('currentAdmin')) {
      window.location.href = 'admin-login.html';
    }
  } else if (!path.includes('login') && !path.includes('signup') && !path.includes('index') && !path.includes('admin-login')) {
    if (!localStorage.getItem('currentUser')) {
      window.location.href = 'login.html';
    }
  }
}

checkAuth();