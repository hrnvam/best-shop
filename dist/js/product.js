import { addToCart, updateCartCount } from "./cartHelper.js";
export function renderSection(products, blockName, containerId, prefix, btnText) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const itemsToRender = blockName
        ? products.filter((p) => p.blocks.indexOf(blockName) !== -1)
        : products;
    container.innerHTML = itemsToRender
        .map((p) => `
      <div
        class="${prefix}__card product ${p.salesStatus ? "product-sale" : ""} section__card"
        data-id="${p.id}"
        style="cursor:pointer"
      >
        <img src="${p.imageUrl}" alt="${p.name}" class="${prefix}__card-image product__image" />
        <div class="product__info-box">
          <p class="${prefix}__card-title product__title">${p.name}</p>
          <p class="${prefix}__card-price product__price">$${p.price}</p>
        </div>
        <a href="#" class="${prefix}__card-link product__link">${btnText}</a>
      </div>
    `)
        .join("");
    container.onclick = (event) => {
        var _a, _b, _c;
        const target = event.target;
        const link = target.closest(".product__link");
        if (link) {
            event.preventDefault();
            const card = link.closest(".product");
            const productIdStr = card === null || card === void 0 ? void 0 : card.getAttribute("data-id");
            const productNameEl = card === null || card === void 0 ? void 0 : card.querySelector(".product__title");
            if (productIdStr) {
                const buttonText = (_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
                if (buttonText === "add to cart") {
                    const productName = (_c = (_b = productNameEl === null || productNameEl === void 0 ? void 0 : productNameEl.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "Item";
                    addToCart(productIdStr, productName);
                    updateCartCount();
                }
                else if (buttonText === "view product") {
                    window.location.href = `/src/html/product-details.html?id=${productIdStr}`;
                }
            }
            return;
        }
        const card = target.closest(".product");
        if (card) {
            const productId = card.getAttribute("data-id");
            if (productId) {
                window.location.href = `/src/html/product-details.html?id=${productId}`;
            }
        }
    };
}
