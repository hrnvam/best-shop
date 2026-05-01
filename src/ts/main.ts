import { Product, renderSection } from "./product.js";
import { initCatalog, renderCatalogUI } from "./catalog.js";
import { initAuthModal } from "./authModal.js";
import { renderHeader } from "./header.js";
import { renderFooter } from "./footer.js";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/src/assets/data.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return (await res.json()).data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export function renderDropdown(products: Product[]) {
  const dropdown = document.getElementById("dropdown-menu");
  if (!dropdown) return;

  dropdown.innerHTML = products
    .slice(0, 3)
    .map(
      (p) => `
    <a href="/src/html/product-details.html?id=${p.id}" class="dropdown__item" style="display:flex; align-items:center; gap:15px; padding:10px; text-decoration:none; color:black;">
      <img src="${p.imageUrl}" alt="" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
      <div style="display:flex; flex-direction:column;">
        <span style="font-weight:600; font-size:14px;">${p.name}</span>
        <span style="color:#B92770; font-weight:700;">$${p.price}</span>
      </div>
    </a>
  `,
    )
    .join("");
}

export function initBurgerMenu() {
  const btn = document.getElementById("burger-menu");
  const nav = document.querySelector(".header__nav");
  const icon = btn?.querySelector("i");

  btn?.addEventListener("click", (e) => {
    e.preventDefault();
    nav?.classList.toggle("header__nav--open");
    icon?.classList.toggle("fa-bars");
    icon?.classList.toggle("fa-xmark");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header-root");
  renderHeader(headerContainer);
  const footerContainer = document.getElementById("footer-root");
  renderFooter(footerContainer);
  initBurgerMenu();
  initAuthModal();
  await initCatalog();
  renderCatalogUI();

  const products = await fetchProducts();
  if (!products.length) return;

  renderDropdown(products);
  renderSection(
    products,
    "Selected Products",
    "selected-products-container",
    "selected",
    "Add To Cart",
  );
  renderSection(
    products,
    "New Products Arrival",
    "new-products-container",
    "news",
    "View Product",
  );
});
