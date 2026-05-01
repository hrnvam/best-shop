export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export function renderFeatures(container: HTMLElement | null, data: Feature[]): void {
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