const Customers = {
    init() {
        this.setupCustomerActions();
        this.setupCustomerSearch();
        this.renderCustomers();
    },

    setupCustomerActions() {
        document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
            Modal.open('Add Customer', App.getCustomerForm());
            this.attachCustomerFormHandler();
        });
    },

    setupCustomerSearch() {
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCustomers(e.target.value);
            });
        }
    },

    attachCustomerFormHandler() {
        setTimeout(() => {
            const form = document.getElementById('customerForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addCustomer(new FormData(form));
                });
            }
        }, 100);
    },

    addCustomer(formData) {
        const newCustomer = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            totalPurchases: 0,
            lastPurchase: null,
            createdAt: new Date().toISOString()
        };

        App.state.customers.push(newCustomer);
        App.saveToStorage();
        App.updateStats();
        this.renderCustomers();
        Modal.close();
    },

    filterCustomers(searchTerm) {
        const customers = App.state.customers.filter(customer => {
            return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   customer.phone.includes(searchTerm);
        });

        this.renderCustomers(customers);
    },

    renderCustomers(customers = App.state.customers) {
        const tbody = document.getElementById('customersTable');
        if (!tbody) return;

        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No customers yet</td></tr>';
            return;
        }

        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>$${customer.totalPurchases.toFixed(2)}</td>
                <td>${customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'Never'}</td>
                <td>
                    <button class="btn-link" onclick="Customers.editCustomer(${customer.id})">Edit</button>
                    <button class="btn-link" onclick="Customers.deleteCustomer(${customer.id})" style="color: #ef4444;">Delete</button>
                </td>
            </tr>
        `).join('');
    },

    editCustomer(customerId) {
        const customer = App.state.customers.find(c => c.id === customerId);
        if (!customer) return;

        const content = `
            <form id="editCustomerForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
                    <input type="text" name="name" value="${customer.name}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                    <input type="email" name="email" value="${customer.email}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone</label>
                    <input type="tel" name="phone" value="${customer.phone}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Save Changes</button>
            </form>
        `;

        Modal.open('Edit Customer', content);

        setTimeout(() => {
            const form = document.getElementById('editCustomerForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    customer.name = formData.get('name');
                    customer.email = formData.get('email');
                    customer.phone = formData.get('phone');
                    App.saveToStorage();
                    this.renderCustomers();
                    Modal.close();
                });
            }
        }, 100);
    },

    deleteCustomer(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            App.state.customers = App.state.customers.filter(c => c.id !== customerId);
            App.saveToStorage();
            App.updateStats();
            this.renderCustomers();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Customers.init();
});
