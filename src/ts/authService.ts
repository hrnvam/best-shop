export interface User {
  name: string;
  email: string;
  passwordHash: string;
}

function hashPassword(pw: string): string {
  return btoa(encodeURIComponent(pw));
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem("auth_users") ?? "[]");
  } catch {
    return [];
  }
}

function setUsers(users: User[]): void {
  localStorage.setItem("auth_users", JSON.stringify(users));
}

export function register(
  name: string,
  email: string,
  password: string,
): { ok: boolean; error?: string } {
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

export function login(
  email: string,
  password: string,
  remember: boolean,
): { ok: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) return { ok: false, error: "No account found with this email." };
  if (user.passwordHash !== hashPassword(password)) {
    return { ok: false, error: "Incorrect password." };
  }

  localStorage.setItem("auth_session", user.email);
  if (remember) {
    localStorage.setItem("auth_remember", user.email);
  } else {
    localStorage.removeItem("auth_remember");
  }

  mergeGuestCart(user.email);

  return { ok: true };
}

export function logout(): void {
  const session = getSession();
  if (session) backupCartToUser(session);

  localStorage.removeItem("auth_session");
  localStorage.removeItem("auth_remember");

  localStorage.removeItem("shopping_cart");
  localStorage.removeItem("shopping_cart_items");
}

export function getSession(): string | null {
  return (
    localStorage.getItem("auth_session") ??
    localStorage.getItem("auth_remember") ??
    null
  );
}

export function getCurrentUser(): User | null {
  const email = getSession();
  if (!email) return null;
  return getUsers().find((u) => u.email === email) ?? null;
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function backupCartToUser(email: string): void {
  const simple = localStorage.getItem("shopping_cart");
  const detailed = localStorage.getItem("shopping_cart_items");
  if (simple) localStorage.setItem(`cart_${email}`, simple);
  if (detailed) localStorage.setItem(`cart_items_${email}`, detailed);
}

export function restoreCartForUser(email: string): void {
  const simple = localStorage.getItem(`cart_${email}`);
  const detailed = localStorage.getItem(`cart_items_${email}`);
  localStorage.setItem("shopping_cart", simple ?? "[]");
  localStorage.setItem("shopping_cart_items", detailed ?? "[]");
}

function mergeGuestCart(email: string): void {
  const savedRaw = localStorage.getItem(`cart_items_${email}`);
  const saved: Array<{ id: string; quantity: number }> = savedRaw
    ? JSON.parse(savedRaw)
    : [];

  const guestRaw = localStorage.getItem("shopping_cart_items");
  const guest: Array<{ id: string; quantity: number }> = guestRaw
    ? JSON.parse(guestRaw)
    : [];

  guest.forEach((gItem) => {
    const existing = saved.find((s) => s.id === gItem.id);
    if (existing) {
      existing.quantity += gItem.quantity;
    } else {
      saved.push({ ...gItem });
    }
  });

  const simple = saved.map((i) => i.id);

  localStorage.setItem("shopping_cart", JSON.stringify(simple));
  localStorage.setItem("shopping_cart_items", JSON.stringify(saved));

  backupCartToUser(email);
}
