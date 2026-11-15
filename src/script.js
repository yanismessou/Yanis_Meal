const days = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

const mealTypes = [
  { key: 'breakfast', label: 'Petit-dejeuner' },
  { key: 'lunch', label: 'Dejeuner' },
  { key: 'dinner', label: 'Diner' },
];

const africanDishes = new Set([
  'Attiéké + poisson',
  'Foutou + sauce graine',
  'Alloco + oeuf',
  'Bouillie de maïs',
]);

const state = {
  dishes: [],
  plan: new Map(),
  shoppingList: [],
  selectedCell: null,
  activeCategory: 'all',
};

const plannerGrid = document.querySelector('#plannerGrid');
const mealModal = document.querySelector('#mealModal');
const shoppingModal = document.querySelector('#shoppingModal');
const modalContext = document.querySelector('#modalContext');
const dishGrid = document.querySelector('#dishGrid');
const dishSearch = document.querySelector('#dishSearch');
const dishCount = document.querySelector('#dishCount');
const shoppingContent = document.querySelector('#shoppingContent');
const resetButton = document.querySelector('#resetButton');
const clearButton = document.querySelector('#clearButton');
const openShoppingButton = document.querySelector('#openShoppingButton');

// Auth elements
const authActions = document.querySelector('#authActions');
const userActions = document.querySelector('#userActions');
const userNameDisplay = document.querySelector('#userNameDisplay');
const authModal = document.querySelector('#authModal');
const authForm = document.querySelector('#authForm');
const authTitle = document.querySelector('#authTitle');
const authMode = document.querySelector('#authMode');
const authUsername = document.querySelector('#authUsername');
const authPassword = document.querySelector('#authPassword');
const authConfirmPassword = document.querySelector('#authConfirmPassword');
const confirmPasswordGroup = document.querySelector('#confirmPasswordGroup');
const authError = document.querySelector('#authError');
const openLoginButton = document.querySelector('#openLoginButton');
const openRegisterButton = document.querySelector('#openRegisterButton');
const logoutButton = document.querySelector('#logoutButton');

document.addEventListener('DOMContentLoaded', init);
resetButton.addEventListener('click', resetWeek);
clearButton.addEventListener('click', clearSelectedCell);
openShoppingButton.addEventListener('click', openShoppingModal);
dishSearch.addEventListener('input', renderDishCards);

openLoginButton.addEventListener('click', () => openAuthModal('login'));
openRegisterButton.addEventListener('click', () => openAuthModal('register'));
logoutButton.addEventListener('click', logout);
authForm.addEventListener('submit', handleAuthSubmit);

document.querySelectorAll('[data-close-auth]').forEach((element) => {
  element.addEventListener('click', closeAuthModal);
});

document.querySelectorAll('[data-close-meal]').forEach((element) => {
  element.addEventListener('click', closeMealModal);
});

document.querySelectorAll('[data-close-shopping]').forEach((element) => {
  element.addEventListener('click', closeShoppingModal);
});

document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeMealModal();
      closeShoppingModal();
      closeAuthModal();
    }
  });
});

document.querySelectorAll('.cat-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.activeCategory = button.dataset.category;
    renderDishCards();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMealModal();
    closeShoppingModal();
    closeAuthModal();
  }
});

async function init() {
  await checkAuth();
  await loadDishes();
}

async function loadDishes() {
  const data = await apiGet('/api/meals/list.php');
  state.dishes = data.dishes;
  dishCount.textContent = String(state.dishes.length);
}

async function loadPlan() {
  const data = await apiGet('/api/planner/get.php');
  state.plan.clear();
  state.shoppingList = data.shopping_list || [];

  data.plan.forEach((item) => {
    state.plan.set(makeKey(item.day_name, item.meal_type), item.dish);
  });

  renderGrid();
  renderShoppingContent();
}

function renderGrid() {
  plannerGrid.innerHTML = '';
  
  if (!state.user) {
    plannerGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding: 40px; background:#f9fafb; border-radius:12px;"><h3>Connectez-vous pour voir et modifier votre planning</h3></div>';
    return;
  }

  plannerGrid.appendChild(createGridCell('', 'corner-cell'));

  days.forEach((day) => {
    plannerGrid.appendChild(createGridCell(day.label, 'day-cell'));
  });

  mealTypes.forEach((meal) => {
    plannerGrid.appendChild(createGridCell(meal.label, 'meal-label'));

    days.forEach((day) => {
      const dish = state.plan.get(makeKey(day.key, meal.key));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'grid-cell meal-slot';
      button.addEventListener('click', () => openMealModal(day, meal));

      if (dish) {
        button.innerHTML = `
          <div class="meal-card">
            <div class="meal-initial">${escapeHtml(getInitials(dish.name))}</div>
            <span class="meal-name">${escapeHtml(dish.name)}</span>
            <span class="meal-category">${escapeHtml(getDishFamily(dish.name))}</span>
          </div>
        `;
      } else {
        button.innerHTML = `
          <div class="slot-empty">
            <span class="empty-plus">+</span>
          </div>
        `;
      }

      plannerGrid.appendChild(button);
    });
  });
}

function createGridCell(text, className) {
  const div = document.createElement('div');
  div.className = `grid-cell ${className}`;
  div.textContent = text;
  return div;
}

function openMealModal(day, meal) {
  state.selectedCell = { day, meal };
  state.activeCategory = 'all';
  dishSearch.value = '';
  modalContext.textContent = `${meal.label} - ${day.label}`;

  document.querySelectorAll('.cat-btn').forEach((item) => item.classList.remove('active'));
  document.querySelector('.cat-btn[data-category="all"]').classList.add('active');

  renderDishCards();
  mealModal.classList.add('open');
  mealModal.setAttribute('aria-hidden', 'false');
}

function closeMealModal() {
  mealModal.classList.remove('open');
  mealModal.setAttribute('aria-hidden', 'true');
  state.selectedCell = null;
}

function openShoppingModal() {
  renderShoppingContent();
  shoppingModal.classList.add('open');
  shoppingModal.setAttribute('aria-hidden', 'false');
}

function closeShoppingModal() {
  shoppingModal.classList.remove('open');
  shoppingModal.setAttribute('aria-hidden', 'true');
}

function renderDishCards() {
  if (!state.selectedCell) {
    return;
  }

  const search = dishSearch.value.toLowerCase().trim();
  
  // Afficher tous les plats peu importe le type de repas (petit-déj, déj, dîner)
  let dishes = state.dishes;

  if (state.activeCategory !== 'all') {
    dishes = dishes.filter((dish) => getDishFamily(dish.name) === state.activeCategory);
  }

  if (search) {
    dishes = dishes.filter((dish) => dish.name.toLowerCase().includes(search));
  }

  dishGrid.innerHTML = '';

  if (dishes.length === 0) {
    dishGrid.innerHTML = '<p class="empty-state">Aucun plat trouve.</p>';
    return;
  }

  dishes.forEach((dish) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'dish-card';
    card.innerHTML = `
      <span class="dish-initial">${escapeHtml(getInitials(dish.name))}</span>
      <span class="dish-name">${escapeHtml(dish.name)}</span>
      <span class="dish-badge">${escapeHtml(getDishFamily(dish.name))}</span>
    `;
    card.addEventListener('click', () => saveSelectedDish(dish.dish_id));
    dishGrid.appendChild(card);
  });
}

async function saveSelectedDish(dishId) {
  if (!state.selectedCell) {
    return;
  }

  const { day, meal } = state.selectedCell;
  await apiPost('/api/planner/save.php', {
    day_name: day.key,
    meal_type: meal.key,
    dish_id: dishId,
  });

  closeMealModal();
  await loadPlan();
}

async function clearSelectedCell() {
  if (!state.selectedCell) {
    return;
  }

  await saveSelectedDish(null);
}

async function resetWeek() {
  const confirmed = window.confirm('Voulez-vous vraiment effacer tous les repas de la semaine ?');
  if (!confirmed) {
    return;
  }

  await apiPost('/api/planner/reset.php', {});
  await loadPlan();
  closeShoppingModal();
}

function renderShoppingContent() {
  shoppingContent.innerHTML = '';

  const items = (state.shoppingList || []).filter((item) => Number(item.quantity) > 0);
  if (items.length === 0) {
    shoppingContent.innerHTML = '<p class="shopping-empty">Aucun repas planifie pour la semaine.</p>';
    return;
  }

  const section = document.createElement('div');
  section.className = 'course-category';
  section.innerHTML = '<h4>Ingredients a acheter</h4>';

  items
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    .forEach((item) => {
      const row = document.createElement('div');
      row.className = 'course-item';
      row.textContent = `${formatQuantity(item.quantity)} ${item.unit || ''} ${item.name}`.trim();
      section.appendChild(row);
    });

  shoppingContent.appendChild(section);
}

// Auth Functions
async function checkAuth() {
  try {
    const data = await apiGet('/api/auth/me.php');
    state.user = data.user;
    updateAuthUI();
    await loadPlan();
  } catch (e) {
    state.user = null;
    updateAuthUI();
    renderGrid();
  }
}

function updateAuthUI() {
  if (state.user) {
    authActions.style.display = 'none';
    userActions.style.display = 'flex';
    userNameDisplay.textContent = state.user.username;
  } else {
    authActions.style.display = 'flex';
    userActions.style.display = 'none';
    userNameDisplay.textContent = '';
  }
}

function openAuthModal(mode) {
  authMode.value = mode;
  authTitle.textContent = mode === 'login' ? 'Connexion' : 'Créer un compte';
  authError.textContent = '';
  authUsername.value = '';
  authPassword.value = '';
  authConfirmPassword.value = '';
  
  if (mode === 'register') {
      confirmPasswordGroup.style.display = 'block';
      authConfirmPassword.required = true;
  } else {
      confirmPasswordGroup.style.display = 'none';
      authConfirmPassword.required = false;
  }
  
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
  authModal.classList.remove('open');
  authModal.setAttribute('aria-hidden', 'true');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  authError.textContent = '';
  
  const mode = authMode.value;
  const payload = {
    username: authUsername.value,
    password: authPassword.value
  };

  if (mode === 'register') {
      if (authPassword.value !== authConfirmPassword.value) {
          authError.textContent = 'Les mots de passe ne correspondent pas.';
          return;
      }
      if (authPassword.value.length < 8) {
          authError.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
          return;
      }
      payload.confirm_password = authConfirmPassword.value;
  }

  try {
    const endpoint = mode === 'login' ? '/api/auth/login.php' : '/api/auth/register.php';
    const data = await apiPost(endpoint, payload);
    state.user = data.user;
    closeAuthModal();
    updateAuthUI();
    await loadPlan();
  } catch (err) {
    authError.textContent = err.message;
  }
}

async function logout() {
  await apiPost('/api/auth/logout.php', {});
  state.user = null;
  state.plan.clear();
  state.shoppingList = [];
  updateAuthUI();
  renderGrid();
}

async function apiGet(url) {
  const response = await fetch(url);
  return parseApiResponse(response);
}

async function apiPost(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse(response);
}

async function parseApiResponse(response) {
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || 'Erreur API.');
  }

  return data;
}

function getDishFamily(name) {
  if (africanDishes.has(name)) {
    return 'africain';
  }

  const normalizedName = normalizeText(name);
  if (normalizedName.includes('riz') || normalizedName.includes('pates') || normalizedName.includes('pain') || normalizedName.includes('omelette') || normalizedName.includes('yaourt') || normalizedName.includes('cereales') || normalizedName.includes('soupe') || normalizedName.includes('salade')) {
    return 'occidental';
  }

  return 'autre';
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getInitials(name) {
  return name
    .split(/[\s+]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function makeKey(day, meal) {
  return `${day}-${meal}`;
}

function formatQuantity(quantity) {
  return Number(quantity).toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
