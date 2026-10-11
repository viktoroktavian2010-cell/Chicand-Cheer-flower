const PRODUCTS = [
  {
    id: "classic-crimson",
    name: "Classic Crimson",
    description: "A timeless armful of velvet red roses with eucalyptus — the grandest way to say it.",
    price: 2490,
    category: "roses",
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "blush-romance",
    name: "Blush Romance",
    description: "Soft pink garden roses and ranunculus, gathered for anniversaries and quiet evenings.",
    price: 2690,
    category: "romantic",
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "white-elegance",
    name: "White Elegance",
    description: "Ivory roses and lisianthus in a cream wrap — serene, luminous, and refined.",
    price: 2390,
    category: "roses",
    image:
      "https://images.unsplash.com/photo-1455659817273-f978642fc588?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "midnight-garden",
    name: "Midnight Garden",
    description: "Deep burgundy blooms with dusty miller, composed for candlelit dinners in the city.",
    price: 2850,
    category: "romantic",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "birthday-glow",
    name: "Birthday Glow",
    description: "A joyful mix of coral roses, gerberas, and spray carnations for a celebratory table.",
    price: 1890,
    category: "birthday",
    image:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sunshine-celebration",
    name: "Sunshine Celebration",
    description: "Golden blooms and playful greens — bright enough to light up any birthday morning.",
    price: 1750,
    category: "birthday",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "odesa-spring",
    name: "Odesa Spring",
    description: "Seasonal hydrangeas and airy fillers, inspired by seaside light and April markets.",
    price: 1650,
    category: "seasonal",
    image:
      "https://images.unsplash.com/photo-1468327768560-75b60c6d73f7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "autumn-whisper",
    name: "Autumn Whisper",
    description: "Warm peach roses and seasonal foliage, gathered for harvest evenings by the sea.",
    price: 1990,
    category: "seasonal",
    image:
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=900&q=80",
  },
];

const CATEGORY_LABELS = {
  roses: "Roses",
  romantic: "Romantic",
  birthday: "Birthday",
  seasonal: "Seasonal",
};

const cart = loadCart();
const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const orderItemsEl = document.getElementById("order-items");
const orderTotalEl = document.getElementById("order-total");
const toastEl = document.getElementById("toast");
const dateInput = document.querySelector('input[name="date"]');

if (dateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().slice(0, 10);
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("chic-cheer-cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("chic-cheer-cart", JSON.stringify(cart));
}

function formatPrice(value) {
  return `${value.toLocaleString("uk-UA")} UAH`;
}

function renderCatalog(filter = "all") {
  const items = PRODUCTS.filter((item) => filter === "all" || item.category === filter);
  productGrid.innerHTML = items
    .map(
      (item) => `
      <article class="product-card">
        <img src="${item.image}" alt="${item.name} bouquet" />
        <div class="product-body">
          <p class="product-cat">${CATEGORY_LABELS[item.category]}</p>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="product-foot">
            <span class="price">${formatPrice(item.price)}</span>
            <button class="btn btn-primary" type="button" data-add="${item.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function cartQuantity() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  cartCount.textContent = String(cartQuantity());

  if (!cart.length) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty. Choose a bouquet to begin.</p>`;
    orderItemsEl.innerHTML = `<p class="empty-cart">No bouquets selected yet.</p>`;
  } else {
    cartItemsEl.innerHTML = cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        return `
          <div class="cart-item">
            <img src="${product.image}" alt="" />
            <div>
              <strong>${product.name}</strong>
              <div class="qty">
                <button type="button" data-qty="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button type="button" data-qty="${product.id}" data-delta="1" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div>
              <p>${formatPrice(product.price * item.qty)}</p>
              <button class="remove-item" type="button" data-remove="${product.id}">Remove</button>
            </div>
          </div>
        `;
      })
      .join("");

    orderItemsEl.innerHTML = cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        return `<div class="summary-item"><span>${product.name} × ${item.qty}</span><span>${formatPrice(
          product.price * item.qty
        )}</span></div>`;
      })
      .join("");
  }

  cartTotalEl.textContent = formatPrice(cartTotal());
  orderTotalEl.textContent = formatPrice(cartTotal());
}

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast("Added to cart");
}

function changeQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const index = cart.findIndex((entry) => entry.id === id);
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  const index = cart.findIndex((entry) => entry.id === id);
  if (index >= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
  showToast("Removed from cart");
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

function openCart() {
  cartDrawer.hidden = false;
}

function closeCart() {
  cartDrawer.hidden = true;
}

function setFilter(filter) {
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.filter === filter);
  });
  renderCatalog(filter);
}

renderCatalog();
renderCart();

document.getElementById("menu-toggle").addEventListener("click", () => {
  const nav = document.getElementById("primary-nav");
  const open = nav.classList.toggle("is-open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".filter-chip, .category-card").forEach((el) => {
  el.addEventListener("click", () => {
    const filter = el.dataset.filter;
    setFilter(filter);
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItemsEl.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  const qty = event.target.closest("[data-qty]");
  if (remove) removeFromCart(remove.dataset.remove);
  if (qty) changeQty(qty.dataset.qty, Number(qty.dataset.delta));
});

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});
document.getElementById("checkout-link").addEventListener("click", closeCart);

document.getElementById("order-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cart.length) {
    showToast("Please add a bouquet first");
    return;
  }
  const form = event.currentTarget;
  form.reset();
  cart.splice(0, cart.length);
  saveCart();
  renderCart();
  showToast("Request received. We will confirm availability by phone.");
});

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Thank you. We will reply shortly.");
});
