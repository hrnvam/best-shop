export function getCart() {
    const saved = localStorage.getItem('shopping_cart');
    return saved ? JSON.parse(saved) : [];
}
export function saveCart(cart) {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
}
export function addToCart(productId, productName) {
    const simpleCart = getCart();
    if (!simpleCart.some(item => item === productId)) {
        simpleCart.push(productId);
        saveCart(simpleCart);
    }
    const raw = localStorage.getItem("shopping_cart_items");
    const detailed = raw ? JSON.parse(raw) : [];
    const existing = detailed.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
        showToast(`Added another "${productName}" to cart!`);
    }
    else {
        detailed.push({ id: productId, quantity: 1 });
        showToast(`Added "${productName}" to cart!`);
    }
    localStorage.setItem("shopping_cart_items", JSON.stringify(detailed));
    updateCartCount();
}
export function updateCartCount() {
    const cart = getCart();
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        countEl.textContent = String(cart.length);
        countEl.style.display = cart.length > 0 ? 'flex' : 'none';
        countEl.classList.add('bump');
        countEl.addEventListener('animationend', () => countEl.classList.remove('bump'), { once: true });
    }
}
let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    msgEl.textContent = message;
    toast.classList.add('show');
    if (toastTimer)
        clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
