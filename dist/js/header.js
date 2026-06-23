export function renderHeader(container) {
    if (!container)
        return;
    const currentPath = window.location.pathname;
    const getActiveClass = (path) => {
        return currentPath.includes(path) ? "header__nav-link--active" : "";
    };
    container.innerHTML = `
    <div class="container">
        <div class="header__top">
          <div class="header__socials">
            <a href="./index.html" class="header__socials-link">
              <i class="fab fa-facebook-f header__socials-icon"></i>
            </a>
            <a href="./index.html" class="header__socials-link">
              <i class="fab fa-twitter header__socials-icon"></i>
            </a>
            <a href="./index.html" class="header__socials-link">
              <i class="fab fa-instagram header__socials-icon"></i>
            </a>
          </div>

          <div class="header__logo">
            <a href="./index.html" class="header__logo-link">
              <img
                src="./assets/images/logo.svg"
                alt="Best Shop Logo"
                class="header__logo-img"
              />
              <h2 class="header__logo-title">Best Shop</h2>
            </a>
          </div>

          <div class="header__user-actions">
            <a href="#" class="header__icon-btn header__icon-btn--user">
              <i class="far fa-user"></i>
            </a>
            <a href="cart.html" class="header__icon-btn">
              <i class="fas fa-shopping-cart"></i>
              <span class="cart-count" style="display: none">0</span>
            </a>
            <a
              href="#"
              class="header__icon-btn header__icon-btn--burger"
              id="burger-menu"
            >
              <i class="fas fa-bars"></i>
            </a>
          </div>
        </div>
        <hr class="header__divider" />

        <nav class="header__nav">
          <ul class="header__nav-list">
            <li class="header__nav-item">
              <a href="./index.html" class="header__nav-link ${currentPath === '/' || currentPath.includes('index.html') ? 'header__nav-link--active' : ''}">Home</a>
            </li>
            <li class="header__nav-item header__nav-item--dropdown">
              <a
                href="catalog.html"
                class="header__nav-link ${getActiveClass('catalog.html')}"
                >Catalog<span class="header__nav-icon"></span
              ></a>
              <div class="dropdown" id="dropdown-menu"></div>
            </li>
            <li class="header__nav-item">
              <a href="about.html" class="header__nav-link ${getActiveClass('about.html')}"
                >About Us</a
              >
            </li>
            <li class="header__nav-item">
              <a href="contact.html" class="header__nav-link ${getActiveClass('contact.html')}"
                >Contact Us</a
              >
            </li>
          </ul>
        </nav>
      </div>
  `;
}
