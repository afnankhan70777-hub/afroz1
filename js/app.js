const App = {
    state: {
        currentView: 'dashboard',
        stats: {
            revenue: 0,
            bankBalance: 0,
            customers: 0,
            products: 0
        },
        transactions: [],
        products: [
            {
                id: 1,
                name: 'Milk',
                category: 'dairy',
                price: 3.99,
                stock: 24,
                image: 'images/product-milk.png'
            },
            {
                id: 2,
                name: 'Cheese',
                category: 'dairy',
                price: 5.49,
                stock: 18,
                image: 'images/product-cheese.png'
            },
            {
                id: 3,
                name: 'Cola',
                category: 'beverages',
                price: 1.99,
                stock: 48,
                image: 'images/product-cola.png'
            },
            {
                id: 4,
                name: 'Chips',
                category: 'snacks',
                price: 2.49,
                stock: 36,
                image: 'images/product-chips.png'
            },
            {
                id: 5,
                name: 'Biscuit',
                category: 'snacks',
                price: 3.29,
                stock: 30,
                image: 'images/product-biscuit.png'
            },
            {
                id: 6,
                name: 'Shampoo',
                category: 'personal-care',
                price: 6.99,
                stock: 15,
                image: 'images/product-shampoo.png'
            }
        ],
        customers: [],
        vendors: []
    },

    init() {
        this.loadFromStorage();
        this.updateStats();
        this.setupEventListeners();
    },

    loadFromStorage() {
        const stored = localStorage.getItem('afrozSwiftData');
        if (stored) {
            const data = JSON.parse(stored);
            this.state = { ...this.state, ...data };
        }
    },

    saveToStorage() {
        localStorage.setItem('afrozSwiftData', JSON.stringify(this.state));
    },

    updateStats() {
        const revenue = this.state.transactions
            .filter(t => t.type === 'sale')
            .reduce((sum, t) => sum + t.amount, 0);

        this.state.stats.revenue = revenue;
        this.state.stats.customers = this.state.customers.length;
        this.state.stats.products = this.state.products.length;

        document.querySelector('.stat-value').textContent = `$${revenue.toFixed(2)}`;
        document.querySelectorAll('.stat-value')[2].textContent = this.state.customers.length;
        document.querySelectorAll('.stat-value')[3].textContent = this.state.products.length;
    },

    setupEventListeners() {
        document.getElementById('dateRange')?.addEventListener('change', (e) => {
            this.filterTransactionsByDate(e.target.value);
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        document.getElementById('notifications')?.addEventListener('click', () => {
            alert('No new notifications');
        });
    },

    handleQuickAction(action) {
        switch(action) {
            case 'new-sale':
                Modal.open('New Sale', this.getSaleForm());
                break;
            case 'new-purchase':
                Modal.open('New Purchase', this.getPurchaseForm());
                break;
            case 'add-customer':
                Modal.open('Add Customer', this.getCustomerForm());
                break;
            case 'add-vendor':
                Modal.open('Add Vendor', this.getVendorForm());
                break;
            case 'add-product':
                Modal.open('Add Product', this.getProductForm());
                break;
            case 'services':
                alert('Services feature coming soon!');
                break;
        }
    },

    getSaleForm() {
        return `
            <form id="saleForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Customer</label>
                    <select name="customer" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <option value="">Select Customer</option>
                        ${this.state.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Product</label>
                    <select name="product" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <option value="">Select Product</option>
                        ${this.state.products.map(p => `<option value="${p.id}">${p.name} - $${p.price}</option>`).join('')}
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Quantity</label>
                    <input type="number" name="quantity" min="1" value="1" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Complete Sale</button>
            </form>
        `;
    },

    getPurchaseForm() {
        return `
            <form id="purchaseForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Vendor</label>
                    <select name="vendor" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <option value="">Select Vendor</option>
                        ${this.state.vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Amount</label>
                    <input type="number" name="amount" min="0" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Record Purchase</button>
            </form>
        `;
    },

    getCustomerForm() {
        return `
            <form id="customerForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
                    <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                    <input type="email" name="email" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone</label>
                    <input type="tel" name="phone" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Add Customer</button>
            </form>
        `;
    },

    getVendorForm() {
        return `
            <form id="vendorForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
                    <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                    <input type="email" name="email" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone</label>
                    <input type="tel" name="phone" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Add Vendor</button>
            </form>
        `;
    },

    getProductForm() {
        return `
            <form id="productForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
                    <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Category</label>
                    <select name="category" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <option value="beverages">Beverages</option>
                        <option value="snacks">Snacks</option>
                        <option value="dairy">Dairy</option>
                        <option value="personal-care">Personal Care</option>
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Price</label>
                    <input type="number" name="price" min="0" step="0.01" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Stock</label>
                    <input type="number" name="stock" min="0" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Add Product</button>
            </form>
        `;
    },

    filterTransactionsByDate(range) {
        console.log('Filtering by:', range);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
