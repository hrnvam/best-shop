// ============================================================
// catalog.ts  (updated)
// Added: Size / Color / Category / Sales filters
// ============================================================

import { fetchProducts } from "./main.js";
import { Product, renderSection } from "./product.js";
import { updateCartCount } from "./cartHelper.js";
import { generateStarsHtml } from "./utils.js";

interface AppState {
  currentPage:   number;
  itemsPerPage:  number;
  sortOrder:     string;
  searchQuery:   string;
  filterSize:     string;
  filterColor:    string;
  filterCategory: string;
  filterSales:    boolean;
}

const state: AppState = {
  currentPage:    1,
  itemsPerPage:   12,
  sortOrder:      "default",
  searchQuery:    "",
  filterSize:     "",
  filterColor:    "",
  filterCategory: "",
  filterSales:    false,
};

let allProducts: Product[] = [];

// ---- Init --------------------------------------------------

export async function initCatalog() {
  allProducts = await fetchProducts();
  updateCartCount();

  initFilters();
  initAdvancedFilters();
  renderSidebarSets();
  renderCatalogUI();
}

// ---- Filtering & sorting -----------------------------------

export function getFilteredProducts(): Product[] {
  let products = [...allProducts];

  // Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().indexOf(q) !== -1);
  }

  // Advanced filters
  if (state.filterSize)     products = products.filter(p => p.size     === state.filterSize);
  if (state.filterColor)    products = products.filter(p => p.color    === state.filterColor);
  if (state.filterCategory) products = products.filter(p => p.category === state.filterCategory);
  if (state.filterSales)    products = products.filter(p => p.salesStatus === true);

  // Sort
  switch (state.sortOrder) {
    case "price-asc":  products.sort((a, b) => a.price - b.price); break;
    case "price-desc": products.sort((a, b) => b.price - a.price); break;
    case "name-asc":   products.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "rating":     products.sort((a, b) => b.rating - a.rating || b.popularity - a.popularity); break;
  }

  return products;
}

export function getPagedProducts(products: Product[]): Product[] {
  const start = (state.currentPage - 1) * state.itemsPerPage;
  return products.slice(start, start + state.itemsPerPage);
}

// ---- State setters -----------------------------------------

export function setPage(page: number) {
  state.currentPage = page;
  renderCatalogUI();
}

export function updateSearchQuery(query: string) {
  state.searchQuery = query;
  state.currentPage = 1;
  renderCatalogUI();
}

export function updateSortOrder(order: string) {
  state.sortOrder = order;
  state.currentPage = 1;
  renderCatalogUI();
}

// ---- Render catalog ----------------------------------------

export function renderCatalogUI() {
  const filtered = getFilteredProducts();
  const paged    = getPagedProducts(filtered);

  renderSection(paged, null, "productGrid", "catalog", "Add To Cart");
  renderResultsCount(filtered.length);
  renderPagination(filtered.length);
}

function renderResultsCount(totalFiltered: number) {
  const countEl = document.getElementById("resultsCount");
  if (!countEl) return;

  if (totalFiltered === 0) {
    countEl.innerHTML = "Showing 0 results";
    return;
  }

  const start = (state.currentPage - 1) * state.itemsPerPage + 1;
  const end   = Math.min(state.currentPage * state.itemsPerPage, totalFiltered);
  countEl.innerHTML = `Showing ${start}–${end} of ${totalFiltered} results`;
}

function renderPagination(totalFiltered: number) {
  const paginationEl = document.getElementById("pagination");
  if (!paginationEl) return;

  const totalPages = Math.ceil(totalFiltered / state.itemsPerPage);

  if (totalPages <= 1) { paginationEl.innerHTML = ""; return; }

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
  paginationEl.onclick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(".pagination__btn");
    if (target) {
      const page = Number(target.getAttribute("data-page"));
      if (page) {
        setPage(page);
        document.getElementById("productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
}

// ---- Basic filters (search + sort) -------------------------

function initFilters() {
  const searchInput = document.getElementById("searchInput") as HTMLInputElement;
  searchInput?.addEventListener("input", (e) => {
    updateSearchQuery((e.target as HTMLInputElement).value);
  });

  const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;
  sortSelect?.addEventListener("change", (e) => {
    updateSortOrder((e.target as HTMLSelectElement).value);
  });
}

// ---- Advanced filters (size / color / category / sales) ---

function initAdvancedFilters() {
  // Populate select options from product data
  populateFilterSelect("filter-size",     [...new Set(allProducts.map(p => p.size).filter(Boolean))]);
  populateFilterSelect("filter-color",    [...new Set(allProducts.map(p => p.color).filter(Boolean))]);
  populateFilterSelect("filter-category", [...new Set(allProducts.map(p => p.category).filter(Boolean))]);

  // Change handlers
  (document.getElementById("filter-size") as HTMLSelectElement)
    ?.addEventListener("change", (e) => {
      state.filterSize = (e.target as HTMLSelectElement).value;
      state.currentPage = 1;
      renderCatalogUI();
    });

  (document.getElementById("filter-color") as HTMLSelectElement)
    ?.addEventListener("change", (e) => {
      state.filterColor = (e.target as HTMLSelectElement).value;
      state.currentPage = 1;
      renderCatalogUI();
    });

  (document.getElementById("filter-category") as HTMLSelectElement)
    ?.addEventListener("change", (e) => {
      state.filterCategory = (e.target as HTMLSelectElement).value;
      state.currentPage = 1;
      renderCatalogUI();
    });

  (document.getElementById("filter-sales") as HTMLInputElement)
    ?.addEventListener("change", (e) => {
      state.filterSales = (e.target as HTMLInputElement).checked;
      state.currentPage = 1;
      renderCatalogUI();
    });

  // Clear filters
  document.getElementById("filters-clear")?.addEventListener("click", () => {
    state.filterSize     = "";
    state.filterColor    = "";
    state.filterCategory = "";
    state.filterSales    = false;
    state.currentPage    = 1;

    (document.getElementById("filter-size")     as HTMLSelectElement).value  = "";
    (document.getElementById("filter-color")    as HTMLSelectElement).value  = "";
    (document.getElementById("filter-category") as HTMLSelectElement).value  = "";
    (document.getElementById("filter-sales")    as HTMLInputElement).checked = false;

    renderCatalogUI();
  });

  // Hide / Show filters panel
  const panel   = document.getElementById("filters-panel")!;
  const hideBtn = document.getElementById("filters-hide")!;
  const showBtn = document.getElementById("filters-show")!;

  hideBtn?.addEventListener("click", () => {
    panel.style.display   = "none";
    hideBtn.style.display = "none";
    showBtn.style.display = "inline-flex";
  });

  showBtn?.addEventListener("click", () => {
    panel.style.display   = "";
    hideBtn.style.display = "";
    showBtn.style.display = "none";
  });
}

function populateFilterSelect(id: string, values: string[]): void {
  const sel = document.getElementById(id) as HTMLSelectElement;
  if (!sel) return;
  values.sort().forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

// ---- Sidebar best sets ------------------------------------

function renderSidebarSets() {
  const bestSetsContainer = document.getElementById("bestSets");
  if (!bestSetsContainer) return;

  const topSets = allProducts.filter((p) => p.blocks.indexOf("Top Best Sets") !== -1);

  bestSetsContainer.innerHTML = topSets.map((p) => `
    <li>
      <img src="${p.imageUrl}" alt="${p.name}" class="best-sets__image" />
      <div class="best-sets__info">
        <h4 class="best-sets__title">${p.name}</h4>
        ${generateStarsHtml(p.rating)}
        <p class="best-sets__price">$${p.price}</p>
      </div>
    </li>
  `).join("");
}
