import { fetchProducts, initBurgerMenu, renderDropdown } from "./main.js";
import { addToCart, updateCartCount } from "./cartHelper.js";
import { renderSection, type Product } from "./product.js";

interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

const DEFAULT_REVIEW: Review = {
  name: "Ella Harper",
  rating: 4,
  date: "June 11, 2025",
  text: "Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti curabitur ac placerat est, sit amet sodales risus.",
};

function initDefaultReview(id: string): void {
  const existing = loadReviews(id);
  if (existing.length === 0) {
    saveReviews(id, [DEFAULT_REVIEW]);
  }
}

function getParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function starsHtml(rating: number, filled = "fas", empty = "far"): string {
  return Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="${i < Math.round(rating) ? filled : empty} fa-star"></i>`,
  ).join("");
}

function reviewsKey(id: string): string {
  return `reviews_${id}`;
}

function loadReviews(id: string): Review[] {
  try {
    const raw = localStorage.getItem(reviewsKey(id));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviews(id: string, reviews: Review[]): void {
  localStorage.setItem(reviewsKey(id), JSON.stringify(reviews));
}

function renderReviews(id: string, productName: string): void {
  const list = document.getElementById("pd-reviews-list")!;
  const title = document.getElementById("pd-reviews-title")!;
  const reviews = loadReviews(id);

  const count = reviews.length;
  title.textContent = `${count} review${count !== 1 ? "s" : ""} for ${productName}`;

  if (count === 0) {
    list.innerHTML = `<p style="color:#aaa;font-size:.88rem;">No reviews yet. Be the first!</p>`;
    return;
  }

  list.innerHTML = reviews
    .map(
      (r) => `
    <div class="pd-review-card">
      <div class="pd-review-card__avatar-placeholder">
        <i class="far fa-user"></i>
      </div>
      <div class="pd-review-card__body">
        <div class="pd-review-card__header">
          <div class="pd-review-card__meta">
            <span class="pd-review-card__name">${r.name}</span>
            <span class="pd-review-card__date">/ ${r.date}</span>
          </div>
          <div class="pd-stars">${starsHtml(r.rating)}</div>
        </div>
        <p class="pd-review-card__text">${r.text}</p>
      </div>
    </div>
  `,
    )
    .join("");
}

function initStarPicker(): { getRating: () => number; reset: () => void } {
  const container = document.getElementById("pd-star-picker")!;
  const stars = Array.from(container.querySelectorAll<HTMLElement>("i"));
  let selected = 0;

  function paint(upTo: number, className: "active" | "hovered"): void {
    stars.forEach((s, i) => {
      s.classList.toggle(className, i < upTo);
    });
  }

  stars.forEach((star, idx) => {
    star.addEventListener("mouseenter", () => paint(idx + 1, "hovered"));
    star.addEventListener("mouseleave", () => paint(0, "hovered"));
    star.addEventListener("click", () => {
      selected = idx + 1;
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < selected);
      });
    });
  });

  return {
    getRating: () => selected,
    reset: () => {
      selected = 0;
      stars.forEach((s) => {
        s.classList.remove("active", "hovered");
      });
    },
  };
}

function initTabs(): void {
  const btns = document.querySelectorAll<HTMLButtonElement>(".pd-tabs__btn");
  const panels = document.querySelectorAll<HTMLDivElement>(".pd-tabs__panel");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab!;

      btns.forEach((b) =>
        b.classList.toggle("pd-tabs__btn--active", b.dataset.tab === target),
      );
      panels.forEach((p) =>
        p.classList.toggle("pd-tabs__panel--active", p.id === `tab-${target}`),
      );
    });
  });
}

function initGallery(images: string[]): void {
  const mainImg = document.getElementById("pd-main-img") as HTMLImageElement;
  const thumbsContainer = document.getElementById("pd-thumbs")!;

  const imgList = images.length ? images : [mainImg.src];

  thumbsContainer.innerHTML = imgList
    .map(
      (src, i) => `
    <img
      src="${src}"
      alt="Thumbnail ${i + 1}"
      class="pd-gallery__thumb${i === 0 ? " pd-gallery__thumb--active" : ""}"
      data-src="${src}"
    />
  `,
    )
    .join("");

  thumbsContainer.addEventListener("click", (e) => {
    const thumb = (e.target as HTMLElement).closest<HTMLImageElement>(
      ".pd-gallery__thumb",
    );
    if (!thumb) return;

    mainImg.style.opacity = "0";
    setTimeout(() => {
      mainImg.src = thumb.dataset.src!;
      mainImg.style.opacity = "1";
    }, 150);

    thumbsContainer
      .querySelectorAll(".pd-gallery__thumb")
      .forEach((t) => t.classList.remove("pd-gallery__thumb--active"));
    thumb.classList.add("pd-gallery__thumb--active");
  });
}

function renderRelated(products: Product[], currentId: string): void {
  const pool = products.filter((p) => String(p.id) !== currentId);
  const picked = shuffle(pool).slice(0, 4);
  renderSection(
    picked,
    null,
    "pd-related-grid",
    "pd-related",
    "Add to cart",
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  initBurgerMenu();
  updateCartCount();

  const productId = getParam("id");
  if (!productId) {
    document.querySelector<HTMLElement>(".pd-main")!.innerHTML =
      "<p style='padding:60px;text-align:center;color:#888;'>Product not found.</p>";
    return;
  }

  initDefaultReview(productId);

  const allProducts = await fetchProducts();
  if (!allProducts.length) return;

  renderDropdown(allProducts);

  const product = allProducts.find((p) => String(p.id) === productId);
  if (!product) {
    document.querySelector<HTMLElement>(".pd-main")!.innerHTML =
      "<p style='padding:60px;text-align:center;color:#888;'>Product not found.</p>";
    return;
  }

  (document.getElementById("pd-name") as HTMLElement).textContent =
    product.name;
  (document.getElementById("pd-price") as HTMLElement).textContent =
    `$${product.price}`;

  const reviews = loadReviews(productId);
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : (product.rating ?? 0);

  document.getElementById("pd-stars")!.innerHTML = starsHtml(avgRating);
  document.getElementById("pd-review-count")!.textContent =
    `(${reviews.length} Clients Review)`;

  const mainImg = document.getElementById("pd-main-img") as HTMLImageElement;
  mainImg.src = product.imageUrl;
  mainImg.alt = product.name;

  initGallery([product.imageUrl]);

  const populateSelect = (id: string, value: string) => {
    const sel = document.getElementById(id) as HTMLSelectElement;
    if (value) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      opt.selected = true;
      sel.appendChild(opt);
    }
  };
  populateSelect("pd-select-size", product.size);
  populateSelect("pd-select-color", product.color);
  populateSelect("pd-select-category", product.category);

  let qty = 1;
  const qtyValue = document.getElementById("pd-qty-value")!;

  document.getElementById("pd-qty-minus")!.addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      qtyValue.textContent = String(qty);
    }
  });
  document.getElementById("pd-qty-plus")!.addEventListener("click", () => {
    qty++;
    qtyValue.textContent = String(qty);
  });

  document.getElementById("pd-add-to-cart")!.addEventListener("click", () => {
    for (let i = 0; i < qty; i++) {
      addToCart(String(product.id), product.name);
    }
  });

  initTabs();
  renderReviews(productId, product.name);

  const starPicker = initStarPicker();

  document.getElementById("review-submit")!.addEventListener("click", () => {
    const textEl = document.getElementById(
      "review-text",
    ) as HTMLTextAreaElement;
    const nameEl = document.getElementById("review-name") as HTMLInputElement;
    const emailEl = document.getElementById("review-email") as HTMLInputElement;
    const msgEl = document.getElementById("review-msg")!;

    const text = textEl.value.trim();
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const rating = starPicker.getRating();

    if (!text || !name || !email) {
      msgEl.textContent = "Please fill in all required fields.";
      msgEl.className = "pd-review-form__msg pd-review-form__msg--error";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msgEl.textContent = "Please enter a valid email address.";
      msgEl.className = "pd-review-form__msg pd-review-form__msg--error";
      return;
    }
    if (rating === 0) {
      msgEl.textContent = "Please select a star rating.";
      msgEl.className = "pd-review-form__msg pd-review-form__msg--error";
      return;
    }

    const existing = loadReviews(productId);
    const newReview: Review = {
      name,
      rating,
      text,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    existing.push(newReview);
    saveReviews(productId, existing);

    textEl.value = "";
    nameEl.value = "";
    emailEl.value = "";
    (document.getElementById("review-save") as HTMLInputElement).checked =
      false;
    starPicker.reset();

    msgEl.textContent = "Thank you! Your review has been submitted.";
    msgEl.className = "pd-review-form__msg pd-review-form__msg--success";

    renderReviews(productId, product.name);

    const allReviews = loadReviews(productId);
    const newAvg =
      allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    document.getElementById("pd-stars")!.innerHTML = starsHtml(newAvg);
    document.getElementById("pd-review-count")!.textContent =
      `(${allReviews.length} Clients Review)`;
  });

  renderRelated(allProducts, productId);
});
