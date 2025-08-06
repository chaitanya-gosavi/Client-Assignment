// --- Product Data ---
const products = [
  { id: 1, name: 'Fresh Bread', price: 30, img: 'https://img.icons8.com/ios-filled/50/000000/bread.png' },
  { id: 2, name: 'Butter', price: 50, img: 'https://img.icons8.com/ios-filled/50/000000/butter.png' },
  { id: 3, name: 'Milk', price: 25, img: 'https://img.icons8.com/ios-filled/50/000000/milk-bottle.png' },
  { id: 4, name: 'Eggs', price: 40, img: 'https://img.icons8.com/ios-filled/50/000000/eggs.png' },
  { id: 5, name: 'Rice', price: 60, img: 'https://img.icons8.com/ios-filled/50/000000/rice-bowl.png' },
  { id: 6, name: 'Vegetables', price: 35, img: 'https://img.icons8.com/ios-filled/50/000000/vegetarian-food-symbol.png' },
];

// --- Render Products ---
function renderProducts(filter = '') {
  const list = document.getElementById('productsList');
  list.innerHTML = '';
  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    list.appendChild(card);
  });
}

// --- Product Search ---
document.getElementById('productSearch').addEventListener('input', function(e) {
  renderProducts(e.target.value);
});

// --- Cart Logic ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(id) {
  let cart = getCart();
  const prod = products.find(p => p.id === id);
  if (prod) cart.push(prod);
  setCart(cart);
  alert('Added to cart!');
}
function updateCartCount() {
  document.getElementById('cartCount').textContent = getCart().length;
}

// --- Cart Modal ---
document.getElementById('cartBtn').onclick = function() {
  showCart();
};
document.getElementById('closeCart').onclick = function() {
  document.getElementById('cart').style.display = 'none';
};
function showCart() {
  const cart = getCart();
  const list = document.getElementById('cartList');
  list.innerHTML = '';
  cart.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ₹${item.price}`;
    list.appendChild(li);
  });
  document.getElementById('cart').style.display = 'block';
}
document.getElementById('checkoutBtn').onclick = function() {
  if (!isLoggedIn()) {
    alert('Please login to book products.');
    return;
  }
  // Save booking to user
  let user = getCurrentUser();
  let cart = getCart();
  if (!user.bookings) user.bookings = [];
  user.bookings = user.bookings.concat(cart);
  saveUser(user);
  setCart([]);
  document.getElementById('checkoutSuccess').style.display = 'block';
  setTimeout(() => {
    document.getElementById('checkoutSuccess').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
  }, 1500);
};

// --- Signup/Login Logic ---
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function saveUser(user) {
  let users = getUsers();
  users = users.map(u => u.phone === user.phone ? user : u);
  saveUsers(users);
  localStorage.setItem('currentUser', JSON.stringify(user));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
function isLoggedIn() {
  return !!getCurrentUser();
}
function logout() {
  localStorage.removeItem('currentUser');
  showHome();
}

// --- Signup Modal ---
const signupModal = document.getElementById('signupModal');
document.getElementById('signupBtn').onclick = function() {
  signupModal.style.display = 'flex';
};
document.getElementById('closeSignup').onclick = function() {
  signupModal.style.display = 'none';
};
document.getElementById('signupForm').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  let users = getUsers();
  if (users.find(u => u.phone === phone)) {
    alert('Phone already registered.');
    return;
  }
  users.push({ name, phone, password, bookings: [] });
  saveUsers(users);
  document.getElementById('signupSuccess').style.display = 'block';
  setTimeout(() => {
    document.getElementById('signupSuccess').style.display = 'none';
    signupModal.style.display = 'none';
  }, 1200);
};

// --- Login Modal ---
const loginModal = document.getElementById('loginModal');
document.getElementById('loginBtn').onclick = function() {
  loginModal.style.display = 'flex';
};
document.getElementById('closeLogin').onclick = function() {
  loginModal.style.display = 'none';
};
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;
  let users = getUsers();
  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) {
    document.getElementById('loginError').style.display = 'block';
    return;
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
  document.getElementById('loginError').style.display = 'none';
  loginModal.style.display = 'none';
  showDashboard();
};

// --- Dashboard ---
function showDashboard() {
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('userDisplayName').textContent = getCurrentUser().name;
  document.getElementById('cartBtn').style.display = 'none';
  // Hide homepage sections
  [ 'home', 'services', 'products', 'news', 'contact' ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Show bookings
  const user = getCurrentUser();
  const bookingList = document.getElementById('bookingList');
  bookingList.innerHTML = '';
  (user.bookings || []).forEach(b => {
    const li = document.createElement('li');
    li.textContent = `${b.name} - ₹${b.price}`;
    bookingList.appendChild(li);
  });
}
function showHome() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('cartBtn').style.display = 'block';
  [ 'home', 'services', 'products', 'news', 'contact' ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });
}
document.getElementById('logoutBtn').onclick = function() {
  logout();
};

// --- Edit Profile ---
const editProfileForm = document.getElementById('editProfileForm');
editProfileForm.onsubmit = function(e) {
  e.preventDefault();
  let user = getCurrentUser();
  user.name = document.getElementById('editDisplayName').value;
  user.phone = document.getElementById('editPhone').value;
  saveUser(user);
  document.getElementById('editProfileSuccess').style.display = 'block';
  setTimeout(() => {
    document.getElementById('editProfileSuccess').style.display = 'none';
    showDashboard();
  }, 1200);
};

// --- Contact Form ---
document.getElementById('contactForm').onsubmit = function(e) {
  e.preventDefault();
  document.getElementById('contactSuccess').style.display = 'block';
  setTimeout(() => {
    document.getElementById('contactSuccess').style.display = 'none';
    document.getElementById('contactForm').reset();
  }, 1200);
};

// --- On Load ---
window.onload = function() {
  renderProducts();
  updateCartCount();
  if (isLoggedIn()) {
    showDashboard();
    // Pre-fill edit profile
    let user = getCurrentUser();
    document.getElementById('editDisplayName').value = user.name;
    document.getElementById('editPhone').value = user.phone;
  } else {
    showHome();
  }
};

// --- Hide modals on outside click ---
window.onclick = function(event) {
  if (event.target === signupModal) signupModal.style.display = 'none';
  if (event.target === loginModal) loginModal.style.display = 'none';
  if (event.target === document.getElementById('cart')) document.getElementById('cart').style.display = 'none';
};