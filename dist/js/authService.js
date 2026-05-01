function hashPassword(pw) {
    return btoa(encodeURIComponent(pw));
}
function getUsers() {
    var _a;
    try {
        return JSON.parse((_a = localStorage.getItem("auth_users")) !== null && _a !== void 0 ? _a : "[]");
    }
    catch (_b) {
        return [];
    }
}
function setUsers(users) {
    localStorage.setItem("auth_users", JSON.stringify(users));
}
export function register(name, email, password) {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
    }
    users.push({
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
    });
    setUsers(users);
    return { ok: true };
}
export function login(email, password, remember) {
    const users = getUsers();
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user)
        return { ok: false, error: "No account found with this email." };
    if (user.passwordHash !== hashPassword(password)) {
        return { ok: false, error: "Incorrect password." };
    }
    localStorage.setItem("auth_session", user.email);
    if (remember) {
        localStorage.setItem("auth_remember", user.email);
    }
    else {
        localStorage.removeItem("auth_remember");
    }
    mergeGuestCart(user.email);
    return { ok: true };
}
export function logout() {
    const session = getSession();
    if (session)
        backupCartToUser(session);
    localStorage.removeItem("auth_session");
    localStorage.removeItem("auth_remember");
    localStorage.removeItem("shopping_cart");
    localStorage.removeItem("shopping_cart_items");
}
export function getSession() {
    var _a, _b;
    return ((_b = (_a = localStorage.getItem("auth_session")) !== null && _a !== void 0 ? _a : localStorage.getItem("auth_remember")) !== null && _b !== void 0 ? _b : null);
}
export function getCurrentUser() {
    var _a;
    const email = getSession();
    if (!email)
        return null;
    return (_a = getUsers().find((u) => u.email === email)) !== null && _a !== void 0 ? _a : null;
}
export function isLoggedIn() {
    return getSession() !== null;
}
export function backupCartToUser(email) {
    const simple = localStorage.getItem("shopping_cart");
    const detailed = localStorage.getItem("shopping_cart_items");
    if (simple)
        localStorage.setItem(`cart_${email}`, simple);
    if (detailed)
        localStorage.setItem(`cart_items_${email}`, detailed);
}
export function restoreCartForUser(email) {
    const simple = localStorage.getItem(`cart_${email}`);
    const detailed = localStorage.getItem(`cart_items_${email}`);
    localStorage.setItem("shopping_cart", simple !== null && simple !== void 0 ? simple : "[]");
    localStorage.setItem("shopping_cart_items", detailed !== null && detailed !== void 0 ? detailed : "[]");
}
function mergeGuestCart(email) {
    const savedRaw = localStorage.getItem(`cart_items_${email}`);
    const saved = savedRaw
        ? JSON.parse(savedRaw)
        : [];
    const guestRaw = localStorage.getItem("shopping_cart_items");
    const guest = guestRaw
        ? JSON.parse(guestRaw)
        : [];
    guest.forEach((gItem) => {
        const existing = saved.find((s) => s.id === gItem.id);
        if (existing) {
            existing.quantity += gItem.quantity;
        }
        else {
            saved.push(Object.assign({}, gItem));
        }
    });
    const simple = saved.map((i) => i.id);
    localStorage.setItem("shopping_cart", JSON.stringify(simple));
    localStorage.setItem("shopping_cart_items", JSON.stringify(saved));
    backupCartToUser(email);
}
