async function loadFeaturedProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=4');
        const products = await response.json();
        
        const container = document.getElementById('featured-products');
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${formatINR(convertToINR(product.price))}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelector('.cart-count').textContent = cart.length;
}

loadFeaturedProducts();
updateCartCount();