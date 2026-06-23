var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { renderSection } from "./product.js";
import { initCatalog, renderCatalogUI } from "./catalog.js";
import { initAuthModal } from "./authModal.js";
import { renderHeader } from "./header.js";
import { renderFooter } from "./footer.js";
export function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("./assets/data.json");
            if (!res.ok)
                throw new Error(`HTTP error! status: ${res.status}`);
            return (yield res.json()).data;
        }
        catch (error) {
            console.error("Fetch error:", error);
            return [];
        }
    });
}
export function renderDropdown(products) {
    const dropdown = document.getElementById("dropdown-menu");
    if (!dropdown)
        return;
    dropdown.innerHTML = products
        .slice(0, 3)
        .map((p) => `
    <a href="product-details.html?id=${p.id}" class="dropdown__item" style="display:flex; align-items:center; gap:15px; padding:10px; text-decoration:none; color:black;">
      <img src="${p.imageUrl}" alt="" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
      <div style="display:flex; flex-direction:column;">
        <span style="font-weight:600; font-size:14px;">${p.name}</span>
        <span style="color:#B92770; font-weight:700;">$${p.price}</span>
      </div>
    </a>
  `)
        .join("");
}
export function initBurgerMenu() {
    const btn = document.getElementById("burger-menu");
    const nav = document.querySelector(".header__nav");
    const icon = btn === null || btn === void 0 ? void 0 : btn.querySelector("i");
    btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", (e) => {
        e.preventDefault();
        nav === null || nav === void 0 ? void 0 : nav.classList.toggle("header__nav--open");
        icon === null || icon === void 0 ? void 0 : icon.classList.toggle("fa-bars");
        icon === null || icon === void 0 ? void 0 : icon.classList.toggle("fa-xmark");
    });
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const headerContainer = document.getElementById("header-root");
    renderHeader(headerContainer);
    const footerContainer = document.getElementById("footer-root");
    renderFooter(footerContainer);
    initBurgerMenu();
    initAuthModal();
    yield initCatalog();
    renderCatalogUI();
    const products = yield fetchProducts();
    if (!products.length)
        return;
    renderDropdown(products);
    renderSection(products, "Selected Products", "selected-products-container", "selected", "Add To Cart");
    renderSection(products, "New Products Arrival", "new-products-container", "news", "View Product");
}));
