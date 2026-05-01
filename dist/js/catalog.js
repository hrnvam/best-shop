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
import { renderSection } from "./product.js";
import { updateCartCount } from "./cartHelper.js";
import { generateStarsHtml } from "./utils.js";
const state = {
    currentPage: 1,
    itemsPerPage: 12,
    sortOrder: "default",
    searchQuery: "",
    filterSize: "",
    filterColor: "",
    filterCategory: "",
    filterSales: false,
};
let allProducts = [];
export function initCatalog() {
    return __awaiter(this, void 0, void 0, function* () {
        allProducts = yield fetchProducts();
        updateCartCount();
        initFilters();
        initAdvancedFilters();
        renderSidebarSets();
        renderCatalogUI();
    });
}
export function getFilteredProducts() {
    let products = [...allProducts];
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        products = products.filter((p) => p.name.toLowerCase().indexOf(q) !== -1);
    }
    if (state.filterSize)
        products = products.filter((p) => p.size === state.filterSize);
    if (state.filterColor)
        products = products.filter((p) => p.color === state.filterColor);
    if (state.filterCategory)
        products = products.filter((p) => p.category === state.filterCategory);
    if (state.filterSales)
        products = products.filter((p) => p.salesStatus === true);
    switch (state.sortOrder) {
        case "price-asc": {
            const sorted = [...products];
            sorted.sort((a, b) => a.price - b.price);
            products = sorted;
            break;
        }
        case "price-desc": {
            const sorted = [...products];
            sorted.sort((a, b) => b.price - a.price);
            products = sorted;
            break;
        }
        case "name-asc": {
            const sorted = [...products];
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            products = sorted;
            break;
        }
        case "rating": {
            const sorted = [...products];
            sorted.sort((a, b) => b.rating - a.rating || b.popularity - a.popularity);
            products = sorted;
            break;
        }
    }
    return products;
}
export function getPagedProducts(products) {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    return products.slice(start, start + state.itemsPerPage);
}
export function setPage(page) {
    state.currentPage = page;
    renderCatalogUI();
}
export function updateSearchQuery(query) {
    state.searchQuery = query;
    state.currentPage = 1;
    renderCatalogUI();
}
export function updateSortOrder(order) {
    state.sortOrder = order;
    state.currentPage = 1;
    renderCatalogUI();
}
export function renderCatalogUI() {
    const filtered = getFilteredProducts();
    const paged = getPagedProducts(filtered);
    renderSection(paged, null, "productGrid", "catalog", "Add To Cart");
    renderResultsCount(filtered.length);
    renderPagination(filtered.length);
}
function renderResultsCount(totalFiltered) {
    const countEl = document.getElementById("resultsCount");
    if (!countEl)
        return;
    if (totalFiltered === 0) {
        countEl.innerHTML = "Showing 0 results";
        return;
    }
    const start = (state.currentPage - 1) * state.itemsPerPage + 1;
    const end = Math.min(state.currentPage * state.itemsPerPage, totalFiltered);
    countEl.innerHTML = `Showing ${start}–${end} of ${totalFiltered} results`;
}
function renderPagination(totalFiltered) {
    const paginationEl = document.getElementById("pagination");
    if (!paginationEl)
        return;
    const totalPages = Math.ceil(totalFiltered / state.itemsPerPage);
    if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
    }
    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === state.currentPage ? "pagination__btn--active" : "";
        html += `<button class="pagination__btn ${activeClass}" data-page="${i}">${i}</button>`;
    }
    if (state.currentPage < totalPages) {
        html += `
      <button class="pagination__btn pagination__next" data-page="${state.currentPage + 1}">
        NEXT
        <svg viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
    }
    paginationEl.innerHTML = html;
    paginationEl.onclick = (e) => {
        var _a;
        const target = e.target.closest(".pagination__btn");
        if (target) {
            const page = Number(target.getAttribute("data-page"));
            if (page) {
                setPage(page);
                (_a = document
                    .getElementById("productGrid")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };
}
function initFilters() {
    const searchInput = document.getElementById("searchInput");
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", (e) => {
        updateSearchQuery(e.target.value);
    });
    const sortSelect = document.getElementById("sortSelect");
    sortSelect === null || sortSelect === void 0 ? void 0 : sortSelect.addEventListener("change", (e) => {
        updateSortOrder(e.target.value);
    });
}
function initAdvancedFilters() {
    var _a, _b, _c, _d, _e;
    populateFilterSelect("filter-size", [
        ...new Set(allProducts.map((p) => p.size).filter(Boolean)),
    ]);
    populateFilterSelect("filter-color", [
        ...new Set(allProducts.map((p) => p.color).filter(Boolean)),
    ]);
    populateFilterSelect("filter-category", [
        ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ]);
    (_a = document.getElementById("filter-size")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", (e) => {
        state.filterSize = e.target.value;
        state.currentPage = 1;
        renderCatalogUI();
    });
    (_b = document.getElementById("filter-color")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (e) => {
        state.filterColor = e.target.value;
        state.currentPage = 1;
        renderCatalogUI();
    });
    (_c = document.getElementById("filter-category")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (e) => {
        state.filterCategory = e.target.value;
        state.currentPage = 1;
        renderCatalogUI();
    });
    (_d = document.getElementById("filter-sales")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", (e) => {
        state.filterSales = e.target.checked;
        state.currentPage = 1;
        renderCatalogUI();
    });
    (_e = document.getElementById("filters-clear")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
        state.filterSize = "";
        state.filterColor = "";
        state.filterCategory = "";
        state.filterSales = false;
        state.currentPage = 1;
        document.getElementById("filter-size").value = "";
        document.getElementById("filter-color").value = "";
        document.getElementById("filter-category").value =
            "";
        document.getElementById("filter-sales").checked =
            false;
        renderCatalogUI();
    });
    const panel = document.getElementById("filters-panel");
    const hideBtn = document.getElementById("filters-hide");
    const showBtn = document.getElementById("filters-show");
    hideBtn === null || hideBtn === void 0 ? void 0 : hideBtn.addEventListener("click", () => {
        panel.style.display = "none";
        hideBtn.style.display = "none";
        showBtn.style.display = "inline-flex";
    });
    showBtn === null || showBtn === void 0 ? void 0 : showBtn.addEventListener("click", () => {
        panel.style.display = "";
        hideBtn.style.display = "";
        showBtn.style.display = "none";
    });
}
function populateFilterSelect(id, values) {
    const sel = document.getElementById(id);
    if (!sel)
        return;
    values
        .sort((a, b) => a.localeCompare(b))
        .forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        sel.appendChild(opt);
    });
}
function renderSidebarSets() {
    const bestSetsContainer = document.getElementById("bestSets");
    if (!bestSetsContainer)
        return;
    const topSets = allProducts.filter((p) => p.blocks.indexOf("Top Best Sets") !== -1);
    bestSetsContainer.innerHTML = topSets
        .map((p) => `
    <li>
      <img src="${p.imageUrl}" alt="${p.name}" class="best-sets__image" />
      <div class="best-sets__info">
        <h4 class="best-sets__title">${p.name}</h4>
        ${generateStarsHtml(p.rating)}
        <p class="best-sets__price">$${p.price}</p>
      </div>
    </li>
  `)
        .join("");
}
