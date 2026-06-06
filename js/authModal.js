import { login, register, isLoggedIn, logout, getCurrentUser, backupCartToUser, getSession, } from "./authService.js";
import { updateCartCount } from "./cartHelper.js";
function createAuthModal() {
    const existing = document.getElementById("auth-modal");
    if (existing)
        return existing;
    const modal = document.createElement("dialog");
    modal.className = "auth-modal";
    modal.id = "auth-modal";
    modal.innerHTML = `
    <div class="auth-card">
      <button class="auth-card__close" id="auth-modal-close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>

      <div class="auth-tabs">
        <button class="auth-tabs__btn auth-tabs__btn--active" data-tab="login">Log In</button>
        <button class="auth-tabs__btn" data-tab="register">Register</button>
      </div>

      <div class="auth-panel auth-panel--active" id="auth-panel-login">
        ${field("login-email", "Email address", "email")}
        ${fieldWithEye("login-password", "login-eye", "Password")}
        <div class="auth-row">
          <label class="auth-check-label" for="login-remember">
            <input type="checkbox" id="login-remember" class="auth-checkbox" />
            Remember me
          </label>
          <a href="#" class="auth-link">Forgot Your Password?</a>
        </div>
        <p class="auth-msg" id="login-msg"></p>
        <button class="auth-btn" id="login-submit">LOG IN</button>
      </div>

      <div class="auth-panel" id="auth-panel-register">
        ${field("reg-name", "Full Name", "text")}
        ${field("reg-email", "Email address", "email")}
        ${fieldWithEye("reg-password", "reg-eye", "Password")}
        ${field("reg-confirm", "Confirm Password", "password")}
        <p class="auth-msg" id="reg-msg"></p>
        <button class="auth-btn" id="reg-submit">REGISTER</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    return modal;
}
function field(id, label, type) {
    return `
    <div class="auth-field">
      <label class="auth-field__label" for="${id}">
        ${label} <span class="auth-field__required">*</span>
      </label>
      <input class="auth-field__input" id="${id}" type="${type}" />
    </div>`;
}
function fieldWithEye(inputId, eyeId, label) {
    return `
    <div class="auth-field">
      <label class="auth-field__label" for="${inputId}">
        ${label} <span class="auth-field__required">*</span>
      </label>
      <div class="auth-field__input-wrap">
        <input class="auth-field__input" id="${inputId}" type="password" />
        <button class="auth-field__eye" id="${eyeId}" type="button">
          <i class="far fa-eye"></i>
        </button>
      </div>
    </div>`;
}
export function initAuthModal() {
    var _a, _b;
    const modal = createAuthModal();
    const closeBtn = modal.querySelector("#auth-modal-close");
    const userBtn = document.querySelector(".header__icon-btn--user");
    function openModal(tab = "login") {
        modal.showModal();
        document.body.style.overflow = "hidden";
        switchTab(tab);
    }
    function closeModal() {
        modal.close();
        document.body.style.overflow = "";
    }
    modal.addEventListener("click", (e) => {
        if (e.target === modal)
            closeModal();
    });
    modal.addEventListener("close", () => {
        document.body.style.overflow = "";
    });
    closeBtn.addEventListener("click", closeModal);
    updateUserIcon();
    userBtn === null || userBtn === void 0 ? void 0 : userBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (isLoggedIn()) {
            backupCartToUser(getSession());
            logout();
            updateCartCount();
            updateUserIcon();
        }
        else {
            openModal("login");
        }
    });
    function updateUserIcon() {
        var _a, _b;
        if (!userBtn)
            return;
        const icon = userBtn.querySelector("i");
        if (isLoggedIn()) {
            icon.className = "fas fa-user-check";
            userBtn.title = `Logged in as ${(_b = (_a = getCurrentUser()) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""}. Click to log out.`;
        }
        else {
            icon.className = "far fa-user";
            userBtn.title = "Log in";
        }
    }
    const tabBtns = modal.querySelectorAll(".auth-tabs__btn");
    const panels = modal.querySelectorAll(".auth-panel");
    function switchTab(tab) {
        tabBtns.forEach((b) => b.classList.toggle("auth-tabs__btn--active", b.dataset.tab === tab));
        panels.forEach((p) => p.classList.toggle("auth-panel--active", p.id === `auth-panel-${tab}`));
        setMsg(modal, "login-msg", "", "clear");
        setMsg(modal, "reg-msg", "", "clear");
    }
    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
    (_a = modal.querySelector("#login-eye")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => toggleEye(modal, "login-password", "login-eye"));
    (_b = modal.querySelector("#reg-eye")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => toggleEye(modal, "reg-password", "reg-eye"));
    modal.querySelector("#login-submit")
        .addEventListener("click", () => {
        var _a;
        setMsg(modal, "login-msg", "", "clear");
        const email = modal.querySelector("#login-email").value.trim();
        const password = modal.querySelector("#login-password").value;
        const remember = modal.querySelector("#login-remember").checked;
        if (!email || !password) {
            setMsg(modal, "login-msg", "Please fill in all fields.", "error");
            return;
        }
        const result = login(email, password, remember);
        if (!result.ok) {
            setMsg(modal, "login-msg", result.error, "error");
            return;
        }
        setMsg(modal, "login-msg", `Welcome back, ${(_a = getCurrentUser()) === null || _a === void 0 ? void 0 : _a.name}!`, "success");
        updateCartCount();
        updateUserIcon();
        setTimeout(closeModal, 900);
    });
    modal.querySelector("#reg-submit")
        .addEventListener("click", () => {
        setMsg(modal, "reg-msg", "", "clear");
        const name = modal.querySelector("#reg-name").value.trim();
        const email = modal.querySelector("#reg-email").value.trim();
        const password = modal.querySelector("#reg-password").value;
        const confirm = modal.querySelector("#reg-confirm").value;
        if (!name || !email || !password || !confirm) {
            setMsg(modal, "reg-msg", "Please fill in all fields.", "error");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMsg(modal, "reg-msg", "Invalid email address.", "error");
            return;
        }
        if (password.length < 6) {
            setMsg(modal, "reg-msg", "Password must be at least 6 characters.", "error");
            return;
        }
        if (password !== confirm) {
            setMsg(modal, "reg-msg", "Passwords do not match.", "error");
            return;
        }
        const result = register(name, email, password);
        if (!result.ok) {
            setMsg(modal, "reg-msg", result.error, "error");
            return;
        }
        setMsg(modal, "reg-msg", "Account created! You can now log in.", "success");
        setTimeout(() => {
            switchTab("login");
            modal.querySelector("#login-email").value = email;
        }, 1000);
    });
    window.addEventListener("beforeunload", () => {
        const session = getSession();
        if (session)
            backupCartToUser(session);
    });
}
function setMsg(ctx, id, text, type) {
    const el = ctx.querySelector(`#${id}`);
    if (!el)
        return;
    if (type === "clear") {
        el.textContent = "";
        el.className = "auth-msg";
    }
    else {
        el.textContent = text;
        el.className = `auth-msg auth-msg--${type}`;
    }
}
function toggleEye(ctx, inputId, btnId) {
    const input = ctx.querySelector(`#${inputId}`);
    const btn = ctx.querySelector(`#${btnId}`);
    const icon = btn.querySelector("i");
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
}
