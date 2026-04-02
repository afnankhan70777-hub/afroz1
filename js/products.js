const Products = {
    init() {
        this.setupProductFilters();
        this.setupProductActions();
        this.renderProducts();
    },

    setupProductFilters() {
        const searchInput = document.getElementById('productSearch');
        const categoryFilter = document.getElementById('categoryFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value, categoryFilter.value);
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterProducts(searchInput.value, e.target.value);
            });
        }
    },

    setupProductActions() {
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            Modal.open('Add Product', App.getProductForm());
            this.attachProductFormHandler();
        });
    },

    attachProductFormHandler() {
        setTimeout(() => {
            const form = document.getElementById('productForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addProduct(new FormData(form));
                });
            }
        }, 100);
    },

    addProduct(formData) {
        const newProduct = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            image: 'images/icon-products.png'
        };

        App.state.products.push(newProduct);
        App.saveToStorage();
        App.updateStats();
        this.renderProducts();
        Modal.close();
    },

    filterProducts(searchTerm, category) {
        const products = App.state.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !category || product.category === category;
            return matchesSearch && matchesCategory;
        });

        this.renderProducts(products);
    },

    renderProducts(products = App.state.products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 32px;">No products found</p>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-category">${this.formatCategory(product.category)}</p>
                    <div class="product-details">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <span class="product-stock">Stock: ${product.stock}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.attachProductCardListeners();
    },

    attachProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                this.showProductDetails(productId);
            });
        });
    },

    showProductDetails(productId) {
        const product = App.state.products.find(p => p.id === productId);
        if (!product) return;

        const content = `
            <div style="text-align: center;">
                <img src="${product.image}" alt="${product.name}" style="max-width: 200px; margin-bottom: 16px;">
                <h3>${product.name}</h3>
                <p style="color: #94a3b8; margin-bottom: 16px;">${this.formatCategory(product.category)}</p>
                <div style="display: flex; justify-content: space-around; margin: 24px 0;">
                    <div>
                        <p style="color: #64748b; font-size: 14px;">Price</p>
                        <p style="font-size: 24px; font-weight: 600; color: #2563eb;">$${product.price.toFixed(2)}</p>
                    </div>
                    <div>
                        <p style="color: #64748b; font-size: 14px;">Stock</p>
                        <p style="font-size: 24px; font-weight: 600;">${product.stock}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-primary" onclick="Products.editProduct(${productId})" style="flex: 1;">Edit</button>
                    <button class="btn-secondary" onclick="Products.deleteProduct(${productId})" style="flex: 1;">Delete</button>
                </div>
            </div>
        `;

        Modal.open(product.name, content);
    },

    editProduct(productId) {
        const product = App.state.products.find(p => p.id === productId);
        if (!product) return;

        const content = `
            <form id="editProductForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
                    <input type="text" name="name" value="${product.name}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Category</label>
                    <select name="category" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <option value="beverages" ${product.category === 'beverages' ? 'selected' : ''}>Beverages</option>
                        <option value="snacks" ${product.category === 'snacks' ? 'selected' : ''}>Snacks</option>
                        <option value="dairy" ${product.category === 'dairy' ? 'selected' : ''}>Dairy</option>
                        <option value="personal-care" ${product.category === 'personal-care' ? 'selected' : ''}>Personal Care</option>
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Price</label>
                    <input type="number" name="price" value="${product.price}" min="0" step="0.01" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Stock</label>
                    <input type="number" name="stock" value="${product.stock}" min="0" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Save Changes</button>
            </form>
        `;

        Modal.open('Edit Product', content);

        setTimeout(() => {
            const form = document.getElementById('editProductForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    product.name = formData.get('name');
                    product.category = formData.get('category');
                    product.price = parseFloat(formData.get('price'));
                    product.stock = parseInt(formData.get('stock'));
                    App.saveToStorage();
                    this.renderProducts();
                    Modal.close();
                });
            }
        }, 100);
    },

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            App.state.products = App.state.products.filter(p => p.id !== productId);
            App.saveToStorage();
            App.updateStats();
            this.renderProducts();
            Modal.close();
        }
    },

    formatCategory(category) {
        return category.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Products.init();
});
