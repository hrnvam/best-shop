import { login, register, isLoggedIn, logout, getCurrentUser, backupCartToUser, getSession } from "./authService.js";
import { updateCartCount } from "./cartHelper.js";

export function initAuthModal(): void {
  const modal    = document.getElementById("auth-modal")!;
  const backdrop = document.getElementById("auth-modal-backdrop")!;
  const closeBtn = document.getElementById("auth-modal-close")!;
  const userBtn  = document.querySelector<HTMLAnchorElement>(".header__icon-btn--user")!;

  function openModal(tab: "login" | "register" = "login"): void {
    modal.classList.add("auth-modal--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    switchTab(tab);
  }

  function closeModal(): void {
    modal.classList.remove("auth-modal--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  updateUserIcon();

  userBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      backupCartToUser(getSession()!);
      logout();
      updateCartCount();
      updateUserIcon();
    } else {
      openModal("login");
    }
  });

  function updateUserIcon(): void {
    if (!userBtn) return;
    const icon = userBtn.querySelector("i")!;
    if (isLoggedIn()) {
      icon.className = "fas fa-user-check";
      userBtn.title = `Logged in as ${getCurrentUser()?.name ?? ""}. Click to log out.`;
    } else {
      icon.className = "far fa-user";
      userBtn.title = "Log in";
    }
  }

  const tabBtns = modal.querySelectorAll<HTMLButtonElement>(".auth-tabs__btn");
  const panels  = modal.querySelectorAll<HTMLDivElement>(".auth-panel");

  function switchTab(tab: "login" | "register"): void {
    tabBtns.forEach(b => b.classList.toggle("auth-tabs__btn--active", b.dataset.tab === tab));
    panels.forEach(p  => p.classList.toggle("auth-panel--active",     p.id === `auth-panel-${tab}`));
    clearMsg("login-msg");
    clearMsg("reg-msg");
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab as "login" | "register"));
  });

  document.getElementById("login-eye")?.addEventListener("click", () => toggleEye("login-password", "login-eye"));
  document.getElementById("reg-eye")?.addEventListener("click",   () => toggleEye("reg-password",   "reg-eye"));

  document.getElementById("login-submit")!.addEventListener("click", () => {
    clearMsg("login-msg");

    const email    = (document.getElementById("login-email")    as HTMLInputElement).value.trim();
    const password = (document.getElementById("login-password") as HTMLInputElement).value;
    const remember = (document.getElementById("login-remember") as HTMLInputElement).checked;

    if (!email || !password) { setMsg("login-msg", "Please fill in all fields.", "error"); return; }

    const result = login(email, password, remember);
    if (!result.ok) { setMsg("login-msg", result.error!, "error"); return; }

    setMsg("login-msg", `Welcome back, ${getCurrentUser()?.name}!`, "success");
    updateCartCount();
    updateUserIcon();
    setTimeout(closeModal, 900);
  });

  document.getElementById("reg-submit")!.addEventListener("click", () => {
    clearMsg("reg-msg");

    const name     = (document.getElementById("reg-name")     as HTMLInputElement).value.trim();
    const email    = (document.getElementById("reg-email")    as HTMLInputElement).value.trim();
    const password = (document.getElementById("reg-password") as HTMLInputElement).value;
    const confirm  = (document.getElementById("reg-confirm")  as HTMLInputElement).value;

    if (!name || !email || !password || !confirm) { setMsg("reg-msg", "Please fill in all fields.", "error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMsg("reg-msg", "Invalid email address.", "error"); return; }
    if (password.length < 6) { setMsg("reg-msg", "Password must be at least 6 characters.", "error"); return; }
    if (password !== confirm) { setMsg("reg-msg", "Passwords do not match.", "error"); return; }

    const result = register(name, email, password);
    if (!result.ok) { setMsg("reg-msg", result.error!, "error"); return; }

    setMsg("reg-msg", "Account created! You can now log in.", "success");
    setTimeout(() => {
      switchTab("login");
      (document.getElementById("login-email") as HTMLInputElement).value = email;
    }, 1000);
  });

  window.addEventListener("beforeunload", () => {
    const session = getSession();
    if (session) backupCartToUser(session);
  });
}

function setMsg(id: string, text: string, type: "error" | "success"): void {
  const el = document.getElementById(id)!;
  el.textContent = text;
  el.className = `auth-msg auth-msg--${type}`;
}

function clearMsg(id: string): void {
  const el = document.getElementById(id);
  if (el) { el.textContent = ""; el.className = "auth-msg"; }
}

function toggleEye(inputId: string, btnId: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const btn   = document.getElementById(btnId)!;
  const icon  = btn.querySelector("i")!;
  input.type = input.type === "password" ? "text" : "password";
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}