import { addToCart, updateCartCount } from "./cartHelper.js";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: string[];
};

export function renderSection(
  products: Product[],
  blockName: string | null,
  containerId: string,
  prefix: string,
  btnText: string,
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const itemsToRender = blockName
    ? products.filter((p) => p.blocks.indexOf(blockName) !== -1)
    : products;

  container.innerHTML = itemsToRender
    .map(
      (p) => `
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
    `,
    )
    .join("");

  container.onclick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest<HTMLElement>(".product__link");

    if (link) {
      event.preventDefault();

      const card = link.closest<HTMLElement>(".product");
      const productIdStr = card?.getAttribute("data-id");
      const productNameEl = card?.querySelector(".product__title");

      if (productIdStr) {
        const buttonText = link.textContent?.trim().toLowerCase();

        if (buttonText === "add to cart") {
          const productName = productNameEl?.textContent?.trim() ?? "Item";
          addToCart(productIdStr, productName);
          updateCartCount();
        } else if (buttonText === "view product") {
          window.location.href = `/src/html/product-details.html?id=${productIdStr}`;
        }
      }

      return;
    }

    const card = target.closest<HTMLElement>(".product");
    if (card) {
      const productId = card.getAttribute("data-id");
      if (productId) {
        window.location.href = `/src/html/product-details.html?id=${productId}`;
      }
    }
  };
}