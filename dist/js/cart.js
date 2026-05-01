var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchProducts } from "./main.js";
import { getCart, saveCart, updateCartCount } from "./cartHelper.js";
import { initBurgerMenu, renderDropdown } from "./main.js";
const SHIPPING_COST = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.1;
const tbody = document.getElementById("cart-tbody");
const cartWrapper = document.getElementById("cart-wrapper");
const cartEmpty = document.getElementById("cart-empty");
const clearBtn = document.getElementById("clear-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const elSubtotal = document.getElementById("summary-subtotal");
const elShipping = document.getElementById("summary-shipping");
const elTotal = document.getElementById("summary-total");
let cartItems = [];
function persistCart() {
    const payload = cartItems.map((ci) => ({
        id: ci.product.id,
        quantity: ci.quantity,
    }));
    localStorage.setItem("shopping_cart_items", JSON.stringify(payload));
    saveCart(cartItems.map((ci) => String(ci.product.id)));
    updateCartCount();
}
function loadDetailedCart() {
    try {
        const raw = localStorage.getItem("shopping_cart_items");
        if (raw)
            return JSON.parse(raw);
    }
    catch (_a) {
        console.log(Error);
    }
    return getCart().map((id) => ({ id, quantity: 1 }));
}
function formatPrice(cents) {
    return `$${cents.toLocaleString("en-US")}`;
}
function createRow(item, index) {
    var _a;
    const { product, quantity } = item;
    const lineTotal = product.price * quantity;
    const tr = document.createElement("tr");
    tr.dataset.index = String(index);
    tr.innerHTML = `
    <td class="cart-row__img-cell">
      <img src="${(_a = product.imageUrl) !== null && _a !== void 0 ? _a : ""}" alt="${product.name}" loading="lazy" />
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
function renderCart() {
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
function updateSummary(subtotal) {
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
tbody.addEventListener("click", (e) => {
    const target = e.target;
    const btn = target.closest("[data-action], .cart-delete-btn");
    if (!btn)
        return;
    const index = Number(btn.dataset.index);
    const action = btn.dataset.action;
    if (action === "increase") {
        cartItems[index].quantity = Math.min(cartItems[index].quantity + 1, 99);
        persistCart();
        renderCart();
    }
    else if (action === "decrease") {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;
        }
        else {
            cartItems.splice(index, 1);
        }
        persistCart();
        renderCart();
    }
    else if (btn.classList.contains("cart-delete-btn")) {
        cartItems.splice(index, 1);
        persistCart();
        renderCart();
    }
});
clearBtn === null || clearBtn === void 0 ? void 0 : clearBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to clear your shopping cart?"))
        return;
    cartItems = [];
    persistCart();
    renderCart();
});
checkoutBtn === null || checkoutBtn === void 0 ? void 0 : checkoutBtn.addEventListener("click", () => {
    cartItems = [];
    persistCart();
    renderCart();
    const msg = document.createElement("p");
    msg.className = "cart-thank-you";
    msg.textContent = "Thank you for your purchase.";
    cartWrapper.after(msg);
    checkoutBtn.disabled = true;
});
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    initBurgerMenu();
    const [allProducts] = yield Promise.all([fetchProducts()]);
    if (allProducts.length) {
        renderDropdown(allProducts);
    }
    const productMap = new Map(allProducts.map((p) => [String(p.id), p]));
    const saved = loadDetailedCart();
    cartItems = saved
        .map((entry) => {
        const product = productMap.get(String(entry.id));
        if (!product)
            return null;
        return { product, quantity: Math.max(1, entry.quantity) };
    })
        .filter((item) => item !== null);
    renderCart();
    updateCartCount();
}));
