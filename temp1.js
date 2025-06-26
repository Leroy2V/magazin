nav a[href="sales.html"] {
    color: #ff6b6b;
    font-weight: bold;
}
// Основные элементы DOM
const DOM = {
  cartModal: document.createElement('div'), // Модальное окно корзины
  cartItems: document.createElement('div'), // Контейнер товаров в корзине
  cartTotal: document.createElement('div'), // Итоговая сумма
  cartCount: document.querySelector('.cart-icon').parentNode, // Иконка корзины
  productsContainer: document.querySelector('.products'), // Контейнер товаров
  searchInput: document.createElement('input'), // Поле поиска (можно добавить в HTML)
  categoryFilter: document.createElement('select') // Фильтр категорий (можно добавить в HTML)
};

// Данные товаров
const products = [
  {
    id: 1,
    name: "Халат женский 'Нежность'",
    price: 2990,
    oldPrice: 3990,
    category: "robes",
    image: "https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb3",
    description: "Мягкий халат из микрофибры с поясом",
    isHit: true
  },
  {
    id: 2,
    name: "Халат мужской 'Комфорт'",
    price: 3490,
    category: "robes",
    image: "https://images.unsplash.com/photo-1591035897819-f4bdf739f446",
    description: "Хлопковый халат с капюшоном"
  },
  {
    id: 3,
    name: "Пижама женская 'Ангел'",
    price: 2790,
    category: "pajamas",
    image: "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d",
    description: "Шелковая пижама с кружевными вставками",
    isNew: true
  },
  {
    id: 4,
    name: "Пижама детская 'Мишки'",
    price: 1990,
    oldPrice: 2490,
    category: "pajamas",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68",
    description: "Теплая фланелевая пижама с мишками"
  }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initCartModal();
  renderProducts(products);
  updateCart();
  setupEventListeners();
});

// Инициализация модального окна корзины
function initCartModal() {
  DOM.cartModal.className = 'cart-modal';
  DOM.cartModal.innerHTML = `
    <div class="cart-modal-content">
      <div class="cart-modal-header">
        <h3>Ваша корзина</h3>
        <button class="close-cart">&times;</button>
      </div>
      <div class="cart-items-container"></div>
      <div class="cart-total">
        <span>Итого:</span>
        <span class="total-price">0 ₽</span>
      </div>
      <button class="checkout-btn">Оформить заказ</button>
    </div>
  `;
  document.body.appendChild(DOM.cartModal);
  
  DOM.cartItems = DOM.cartModal.querySelector('.cart-items-container');
  DOM.cartTotal = DOM.cartModal.querySelector('.total-price');
}

// Рендер товаров
function renderProducts(productsToRender) {
  DOM.productsContainer.innerHTML = productsToRender.map(product => `
    <div class="product-card" data-id="${product.id}">
      ${product.isHit ? '<span class="product-badge">Хит</span>' : ''}
      ${product.isNew ? '<span class="product-badge new">Новинка</span>' : ''}
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">${product.price.toLocaleString()} ₽</span>
          ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
        </div>
        <button class="add-to-cart" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i> В корзину
        </button>
      </div>
    </div>
  `).join('');
}

// Работа с корзиной
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showToast(`"${product.name}" добавлен в корзину`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showToast('Товар удален из корзины');
}

function updateCart() {
  // Сохраняем в LocalStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Обновляем счетчик в иконке корзины
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCount > 0) {
    DOM.cartCount.innerHTML = `<i class="fas fa-shopping-cart cart-icon"></i><span class="cart-count">${totalCount}</span>`;
  } else {
    DOM.cartCount.innerHTML = '<i class="fas fa-shopping-cart cart-icon"></i>';
  }
  
  // Обновляем содержимое корзины
  DOM.cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-controls">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
          <span class="cart-item-price">${(item.price * item.quantity).toLocaleString()} ₽</span>
        </div>
      </div>
      <button class="remove-item-btn" data-id="${item.id}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
  
  // Обновляем итоговую сумму
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  DOM.cartTotal.textContent = total.toLocaleString() + ' ₽';
}

// Вспомогательные функции
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 100);
}

function toggleCartModal() {
  DOM.cartModal.classList.toggle('show');
  document.body.classList.toggle('no-scroll');
}

// Обработчики событий
function setupEventListeners() {
  // Добавление в корзину
  DOM.productsContainer.addEventListener('click', e => {
    if (e.target.closest('.add-to-cart')) {
      const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
      addToCart(productId);
    }
  });

  // Управление корзиной
  DOM.cartModal.addEventListener('click', e => {
    if (e.target.closest('.close-cart') || e.target === DOM.cartModal) {
      toggleCartModal();
    }
    
    if (e.target.closest('.remove-item-btn')) {
      const productId = parseInt(e.target.closest('.remove-item-btn').dataset.id);
      removeFromCart(productId);
    }
    
    if (e.target.closest('.quantity-btn.minus')) {
      const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
      const item = cart.find(item => item.id === productId);
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        removeFromCart(productId);
      }
      updateCart();
    }
    
    if (e.target.closest('.quantity-btn.plus')) {
      const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
      const item = cart.find(item => item.id === productId);
      item.quantity += 1;
      updateCart();
    }
    
    if (e.target.closest('.checkout-btn')) {
      if (cart.length > 0) {
        alert('Оформление заказа! В реальном магазине здесь будет переход к оформлению.');
      } else {
        alert('Корзина пуста! Добавьте товары.');
      }
    }
  });

  // Открытие корзины по клику на иконку
  document.querySelector('.cart-icon').closest('div').addEventListener('click', toggleCartModal);

  // Подписка на рассылку
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = e.target.querySelector('input').value;
      if (email) {
        showToast('Спасибо за подписку!');
        e.target.querySelector('input').value = '';
      }
    });
  }
}
// Таймер акции
function updateSaleTimer() {
    const endDate = new Date('2023-12-31T23:59:59');
    const now = new Date();
    const diff = endDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    document.querySelector('.promo-content p').innerHTML = 
        `Осталось: ${days} дней ${hours} часов`;
}

// Вызывать каждую секунду
setInterval(updateSaleTimer, 1000);