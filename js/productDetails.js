var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchProducts, initBurgerMenu, renderDropdown } from "./main.js";
import { addToCart, updateCartCount } from "./cartHelper.js";
import { renderSection } from "./product.js";
const DEFAULT_REVIEW = {
    name: "Ella Harper",
    rating: 4,
    date: "June 11, 2025",
    text: "Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti curabitur ac placerat est, sit amet sodales risus.",
};
function initDefaultReview(id) {
    const existing = loadReviews(id);
    if (existing.length === 0) {
        saveReviews(id, [DEFAULT_REVIEW]);
    }
}
function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}
function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}
function starsHtml(rating, filled = "fas", empty = "far") {
    return Array.from({ length: 5 }, (_, i) => `<i class="${i < Math.round(rating) ? filled : empty} fa-star"></i>`).join("");
}
function reviewsKey(id) {
    return `reviews_${id}`;
}
function loadReviews(id) {
    try {
        const raw = localStorage.getItem(reviewsKey(id));
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
function saveReviews(id, reviews) {
    localStorage.setItem(reviewsKey(id), JSON.stringify(reviews));
}
function renderReviews(id, productName) {
    const list = document.getElementById("pd-reviews-list");
    const title = document.getElementById("pd-reviews-title");
    const reviews = loadReviews(id);
    const count = reviews.length;
    title.textContent = `${count} review${count !== 1 ? "s" : ""} for ${productName}`;
    if (count === 0) {
        list.innerHTML = `<p style="color:#aaa;font-size:.88rem;">No reviews yet. Be the first!</p>`;
        return;
    }
    list.innerHTML = reviews
        .map((r) => `
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
  `)
        .join("");
}
function initStarPicker() {
    const container = document.getElementById("pd-star-picker");
    const stars = Array.from(container.querySelectorAll("i"));
    let selected = 0;
    function paint(upTo, className) {
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
function initTabs() {
    const btns = document.querySelectorAll(".pd-tabs__btn");
    const panels = document.querySelectorAll(".pd-tabs__panel");
    btns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;
            btns.forEach((b) => b.classList.toggle("pd-tabs__btn--active", b.dataset.tab === target));
            panels.forEach((p) => p.classList.toggle("pd-tabs__panel--active", p.id === `tab-${target}`));
        });
    });
}
function initGallery(images) {
    const mainImg = document.getElementById("pd-main-img");
    const thumbsContainer = document.getElementById("pd-thumbs");
    const imgList = images.length ? images : [mainImg.src];
    thumbsContainer.innerHTML = imgList
        .map((src, i) => `
    <img
      src="${src}"
      alt="Thumbnail ${i + 1}"
      class="pd-gallery__thumb${i === 0 ? " pd-gallery__thumb--active" : ""}"
      data-src="${src}"
    />
  `)
        .join("");
    thumbsContainer.addEventListener("click", (e) => {
        const thumb = e.target.closest(".pd-gallery__thumb");
        if (!thumb)
            return;
        mainImg.style.opacity = "0";
        setTimeout(() => {
            mainImg.src = thumb.dataset.src;
            mainImg.style.opacity = "1";
        }, 150);
        thumbsContainer
            .querySelectorAll(".pd-gallery__thumb")
            .forEach((t) => t.classList.remove("pd-gallery__thumb--active"));
        thumb.classList.add("pd-gallery__thumb--active");
    });
}
function renderRelated(products, currentId) {
    const pool = products.filter((p) => String(p.id) !== currentId);
    const picked = shuffle(pool).slice(0, 4);
    renderSection(picked, null, "pd-related-grid", "pd-related", "Add to cart");
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    initBurgerMenu();
    updateCartCount();
    const productId = getParam("id");
    if (!productId) {
        document.querySelector(".pd-main").innerHTML =
            "<p style='padding:60px;text-align:center;color:#888;'>Product not found.</p>";
        return;
    }
    initDefaultReview(productId);
    const allProducts = yield fetchProducts();
    if (!allProducts.length)
        return;
    renderDropdown(allProducts);
    const product = allProducts.find((p) => String(p.id) === productId);
    if (!product) {
        document.querySelector(".pd-main").innerHTML =
            "<p style='padding:60px;text-align:center;color:#888;'>Product not found.</p>";
        return;
    }
    document.getElementById("pd-name").textContent =
        product.name;
    document.getElementById("pd-price").textContent =
        `$${product.price}`;
    const reviews = loadReviews(productId);
    const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : ((_a = product.rating) !== null && _a !== void 0 ? _a : 0);
    document.getElementById("pd-stars").innerHTML = starsHtml(avgRating);
    document.getElementById("pd-review-count").textContent =
        `(${reviews.length} Clients Review)`;
    const mainImg = document.getElementById("pd-main-img");
    mainImg.src = product.imageUrl;
    mainImg.alt = product.name;
    initGallery([product.imageUrl]);
    const populateSelect = (id, value) => {
        const sel = document.getElementById(id);
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
    const qtyValue = document.getElementById("pd-qty-value");
    document.getElementById("pd-qty-minus").addEventListener("click", () => {
        if (qty > 1) {
            qty--;
            qtyValue.textContent = String(qty);
        }
    });
    document.getElementById("pd-qty-plus").addEventListener("click", () => {
        qty++;
        qtyValue.textContent = String(qty);
    });
    document.getElementById("pd-add-to-cart").addEventListener("click", () => {
        for (let i = 0; i < qty; i++) {
            addToCart(String(product.id), product.name);
        }
    });
    initTabs();
    renderReviews(productId, product.name);
    const starPicker = initStarPicker();
    document.getElementById("review-submit").addEventListener("click", () => {
        const textEl = document.getElementById("review-text");
        const nameEl = document.getElementById("review-name");
        const emailEl = document.getElementById("review-email");
        const msgEl = document.getElementById("review-msg");
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
        const newReview = {
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
        document.getElementById("review-save").checked =
            false;
        starPicker.reset();
        msgEl.textContent = "Thank you! Your review has been submitted.";
        msgEl.className = "pd-review-form__msg pd-review-form__msg--success";
        renderReviews(productId, product.name);
        const allReviews = loadReviews(productId);
        const newAvg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
        document.getElementById("pd-stars").innerHTML = starsHtml(newAvg);
        document.getElementById("pd-review-count").textContent =
            `(${allReviews.length} Clients Review)`;
    });
    renderRelated(allProducts, productId);
}));
