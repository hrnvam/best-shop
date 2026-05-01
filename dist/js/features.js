export function renderFeatures(container, data) {
    if (!container) {
        console.error('element not found');
        return;
    }
    container.innerHTML = data.map(feature => `
    <div class="feature">
      <img src="${feature.icon}" alt="${feature.title}" class="feature__icon" />
      <h3 class="feature__title">${feature.title}</h3>
      <p class="feature__description">${feature.description}</p>
    </div>
  `).join('');
}
