function toggleSubMenu(button) {
  const subMenu = button.nextElementSibling;
  if (subMenu) {
    subMenu.classList.toggle('show');
    button.classList.toggle('rotate');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('close');
    });
  }
});
/* =========================================
   1. SIDEBAR & DROPDOWN MENU CONTROLS
========================================= */
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
  if (!sidebar) return;
  sidebar.classList.toggle('close');
  if (toggleButton) {
    toggleButton.classList.toggle('rotate');
  }
  closeAllSubMenus();
}

function toggleSubMenu(button) {
  if (!button || !button.nextElementSibling) return;

  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  if (sidebar && sidebar.classList.contains('close')) {
    sidebar.classList.remove('close');
    if (toggleButton) toggleButton.classList.remove('rotate');
  }
}

function closeAllSubMenus() {
  if (!sidebar) return;
  Array.from(sidebar.getElementsByClassName('show')).forEach((ul) => {
    ul.classList.remove('show');
    if (ul.previousElementSibling) {
      ul.previousElementSibling.classList.remove('rotate');
    }
  });
}

/* =========================================
   2. SHOPPING CART FUNCTIONALITY
========================================= */
let cart = JSON.parse(localStorage.getItem('amazonCloneCart')) || [];

function saveCart() {
  localStorage.setItem('amazonCloneCart', JSON.stringify(cart));
  renderCart();
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price: parseFloat(price), qty: 1 });
  }
  saveCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function checkoutCart() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you for your order! Your purchase has been placed.');
  cart = [];
  saveCart();
  toggleCart();
}

function renderCart() {
  const cartCount = document.getElementById('cartCount');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartTotalEl) {
    cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="color:#666; font-size:13px; text-align:center; margin-top:30px;">Your cart is empty.</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <div style="font-size:12px; color:#666;">$${item.price.toFixed(2)} &times; ${item.qty}</div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#d9534f; font-size:12px; font-weight:600;">
          Remove
        </button>
      </div>
    `
    )
    .join('');
}

/* =========================================
   3. NOTIFICATIONS DROPDOWN
========================================= */
function toggleNotifications() {
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

function markAllRead() {
  const unreadItems = document.querySelectorAll('.notif-item');
  unreadItems.forEach((item) => item.classList.add('read'));

  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = '0';
  }
}

/* =========================================
   4. AUTH MODAL (SIGN IN / CREATE ACCOUNT)
========================================= */
function openAuthModal(tab = 'signin') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    switchAuthTab(tab);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function switchAuthTab(tab) {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const signInTab = document.getElementById('signInTab');
  const signUpTab = document.getElementById('signUpTab');

  if (!signInForm || !signUpForm) return;

  if (tab === 'signin') {
    signInForm.style.display = 'flex';
    signUpForm.style.display = 'none';
    if (signInTab) signInTab.classList.add('active');
    if (signUpTab) signUpTab.classList.remove('active');
  } else {
    signInForm.style.display = 'none';
    signUpForm.style.display = 'flex';
    if (signUpTab) signUpTab.classList.add('active');
    if (signInTab) signInTab.classList.remove('active');
  }
}

function handleAuthSubmit(event, type) {
  event.preventDefault();
  const form = event.target;
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');

  const userName = nameInput
    ? nameInput.value.trim()
    : emailInput.value.split('@')[0];

  localStorage.setItem('amazonCloneUser', JSON.stringify({
    name: userName,
    email: emailInput.value.trim()
  }));

  updateUserUI();
  closeAuthModal();
  alert(type === 'signin' ? `Welcome back, ${userName}!` : `Account created! Welcome, ${userName}!`);
}

function updateUserUI() {
  const savedUser = JSON.parse(localStorage.getItem('amazonCloneUser'));
  const accountBtn = document.getElementById('accountBtn');
  if (savedUser && accountBtn) {
    accountBtn.textContent = `Hi, ${savedUser.name}`;
  }
}

/* =========================================
   5. INITIALIZE ON PAGE LOAD
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Render saved cart & logged-in user
  renderCart();
  updateUserUI();

  // Automatically wire up all ".add-cart" buttons on product cards
  document.querySelectorAll('.add-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (!card) return;

      const titleEl = card.querySelector('h3');
      const priceEl = card.querySelector('.price');

      const name = titleEl ? titleEl.textContent.trim() : 'Product';
      // Extract numeric value from price text (e.g., "$49.99" or "$49.99 $60.00")
      const priceMatch = priceEl ? priceEl.textContent.match(/[\d.]+/) : null;
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

      addToCart(name, price);

      // Quick visual confirmation on button
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1000);
    });
  });

  // Close notification dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const notifWrapper = document.querySelector('.notif-wrapper');
    const notifDropdown = document.getElementById('notifDropdown');
    if (notifWrapper && notifDropdown && !notifWrapper.contains(e.target)) {
      notifDropdown.classList.remove('active');
    }
  });
});

