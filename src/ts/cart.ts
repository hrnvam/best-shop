import { fetchProducts, initBurgerMenu, renderDropdown } from "./main.js";
import { getCart, saveCart, updateCartCount } from "./cartHelper.js";
import type { Product } from "./product.js";

interface CartItem {
  product: Product;
  quantity: number;
}

const SHIPPING_COST = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.1;

const tbody = document.getElementById("cart-tbody") as HTMLTableSectionElement;
const cartWrapper = document.getElementById("cart-wrapper") as HTMLDivElement;
const cartEmpty = document.getElementById("cart-empty") as HTMLDivElement;
const clearBtn = document.getElementById("clear-cart-btn") as HTMLButtonElement;
const checkoutBtn = document.getElementById(
  "checkout-btn",
) as HTMLButtonElement;
const elSubtotal = document.getElementById(
  "summary-subtotal",
) as HTMLSpanElement;
const elShipping = document.getElementById(
  "summary-shipping",
) as HTMLSpanElement;
const elTotal = document.getElementById("summary-total") as HTMLSpanElement;

let cartItems: CartItem[] = [];

function persistCart(): void {
  const payload = cartItems.map((ci) => ({
    id: ci.product.id,
    quantity: ci.quantity,
  }));
  localStorage.setItem("shopping_cart_items", JSON.stringify(payload));
  saveCart(cartItems.map((ci) => String(ci.product.id)));
  updateCartCount();
}

function loadDetailedCart(): Array<{ id: string; quantity: number }> {
  try {
    const raw = localStorage.getItem("shopping_cart_items");
    if (raw) return JSON.parse(raw);
  } catch {
    console.log(Error);
  }
  return getCart().map((id: string) => ({ id, quantity: 1 }));
}

function formatPrice(cents: number): string {
  return `$${cents.toLocaleString("en-US")}`;
}

function createRow(item: CartItem, index: number): HTMLTableRowElement {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  const tr = document.createElement("tr");
  tr.dataset.index = String(index);

  tr.innerHTML = `
    <td class="cart-row__img-cell">
      <img src="${product.imageUrl ?? ""}" alt="${product.name}" loading="lazy" />
    </td>
    <td class="cart-row__name">${product.name}</td>
    <td class="cart-row__price">${formatPrice(product.price)}</td>
    <td class="cart-row__qty">
      <div class="qty-control">
        <button class="qty-control__btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">
          <i class="fas fa-minus"></i>
        </button>
        <span class="qty-control__value">${quantity}</span>
        <button class="qty-control__btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </td>
    <td class="cart-row__total">${formatPrice(lineTotal)}</td>
    <td class="cart-row__delete">
      <button class="cart-delete-btn" data-index="${index}" aria-label="Remove item">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  `;

  return tr;
}

function renderCart(): void {
  tbody.innerHTML = "";

  if (cartItems.length === 0) {
    cartWrapper.style.display = "none";
    cartEmpty.style.display = "flex";
    updateSummary(0);
    updateCartCount();
    return;
  }

  cartWrapper.style.display = "block";
  cartEmpty.style.display = "none";

  let subtotal = 0;
  cartItems.forEach((item, idx) => {
    tbody.appendChild(createRow(item, idx));
    subtotal += item.product.price * item.quantity;
  });

  updateSummary(subtotal);
}

function updateSummary(subtotal: number): void {
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  
  const discount = subtotal > DISCOUNT_THRESHOLD ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discount + shipping;

  elSubtotal.textContent = formatPrice(subtotal);
  elShipping.textContent = formatPrice(shipping);

  const discountRow = document.getElementById("summary-discount-row");
  const elDiscount = document.getElementById("summary-discount");
  if (discountRow && elDiscount) {
    discountRow.style.display = discount > 0 ? "flex" : "none";
    elDiscount.textContent = `- ${formatPrice(discount)}`;
  }

  elTotal.textContent = formatPrice(total);
}

tbody.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLButtonElement>(
    "[data-action], .cart-delete-btn",
  );
  if (!btn) return;

  const index = Number(btn.dataset.index);
  const action = btn.dataset.action;

  if (action === "increase") {
    cartItems[index].quantity = Math.min(cartItems[index].quantity + 1, 99);
    persistCart();
    renderCart();
  } else if (action === "decrease") {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      cartItems.splice(index, 1);
    }
    persistCart();
    renderCart();
  } else if (btn.classList.contains("cart-delete-btn")) {
    cartItems.splice(index, 1);
    persistCart();
    renderCart();
  }
});

clearBtn?.addEventListener("click", () => {
  if (!confirm("Are you sure you want to clear your shopping cart?")) return;
  cartItems = [];
  persistCart();
  renderCart();
});

checkoutBtn?.addEventListener("click", () => {
  cartItems = [];
  persistCart();
  renderCart();

  const msg = document.createElement("p");
  msg.className = "cart-thank-you";
  msg.textContent = "Thank you for your purchase.";
  cartWrapper.after(msg);

  checkoutBtn.disabled = true;
});

document.addEventListener("DOMContentLoaded", async () => {
  initBurgerMenu();

  const [allProducts] = await Promise.all([fetchProducts()]);

  if (allProducts.length) {
    renderDropdown(allProducts);
  }

  const productMap = new Map<string, Product>(
    allProducts.map((p) => [String(p.id), p]),
  );

  const saved = loadDetailedCart();
  cartItems = saved
    .map((entry) => {
      const product = productMap.get(String(entry.id));
      if (!product) return null;
      return { product, quantity: Math.max(1, entry.quantity) } as CartItem;
    })
    .filter((item): item is CartItem => item !== null);

  renderCart();
  updateCartCount();
});
