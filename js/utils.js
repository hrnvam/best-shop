export function generateStarsHtml(rating) {
    const MAX_STARS = 5;
    let html = '<div class="product-rating">';
    for (let i = 1; i <= MAX_STARS; i++) {
        if (rating >= i) {
            html += '<span class="star star--full">★</span>';
        }
        else if (rating >= i - 0.5) {
            html += '<span class="star star--half">★</span>';
        }
        else {
            html += '<span class="star star--empty">★</span>';
        }
    }
    html += '</div>';
    return html;
}
