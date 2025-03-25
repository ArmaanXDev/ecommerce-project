let products = [];
let filteredProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        filteredProducts = [...products];
        displayProducts(products);
        setupCategories();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(productsToShow) {
    const container = document.getElementById('products-container');
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">${formatINR(convertToINR(product.price))}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function setupCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    const categoryFilters = document.getElementById('category-filters');
    
    categoryFilters.innerHTML = categories.map(category => `
        <div>
            <input type="checkbox" id="${category}" value="${category}">
            <label for="${category}">${category}</label>
        </div>
    `).join('');

    categoryFilters.addEventListener('change', filterProducts);
}

function filterProducts() {
    const selectedCategories = [...document.querySelectorAll('#category-filters input:checked')]
        .map(input => input.value);
    const maxPrice = document.getElementById('price-range').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.length === 0 || 
            selectedCategories.includes(product.category);
        const matchesPrice = convertToINR(product.price) <= maxPrice;
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesPrice && matchesSearch;
    });

    sortProducts();
}

function sortProducts() {
    const sortValue = document.getElementById('sort').value;
    
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    displayProducts(filteredProducts);
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

// Event Listeners
document.getElementById('search').addEventListener('input', filterProducts);
document.getElementById('price-range').addEventListener('input', (e) => {
    document.getElementById('price-value').textContent = formatINR(e.target.value);
    filterProducts();
});
document.getElementById('sort').addEventListener('change', sortProducts);

// Initialize
fetchProducts();
updateCartCount();