const Vendors = {
    init() {
        this.setupVendorActions();
        this.setupVendorSearch();
        this.renderVendors();
    },

    setupVendorActions() {
        document.getElementById('addVendorBtn')?.addEventListener('click', () => {
            Modal.open('Add Vendor', App.getVendorForm());
            this.attachVendorFormHandler();
        });
    },

    setupVendorSearch() {
        const searchInput = document.getElementById('vendorSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterVendors(e.target.value);
            });
        }
    },

    attachVendorFormHandler() {
        setTimeout(() => {
            const form = document.getElementById('vendorForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addVendor(new FormData(form));
                });
            }
        }, 100);
    },

    addVendor(formData) {
        const newVendor = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            totalOrders: 0,
            lastOrder: null,
            createdAt: new Date().toISOString()
        };

        App.state.vendors.push(newVendor);
        App.saveToStorage();
        this.renderVendors();
        Modal.close();
    },

    filterVendors(searchTerm) {
        const vendors = App.state.vendors.filter(vendor => {
            return vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   vendor.phone.includes(searchTerm);
        });

        this.renderVendors(vendors);
    },

    renderVendors(vendors = App.state.vendors) {
        const tbody = document.getElementById('vendorsTable');
        if (!tbody) return;

        if (vendors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No vendors yet</td></tr>';
            return;
        }

        tbody.innerHTML = vendors.map(vendor => `
            <tr>
                <td>${vendor.name}</td>
                <td>${vendor.email}</td>
                <td>${vendor.phone}</td>
                <td>${vendor.totalOrders}</td>
                <td>${vendor.lastOrder ? new Date(vendor.lastOrder).toLocaleDateString() : 'Never'}</td>
                <td>
                    <button class="btn-link" onclick="Vendors.editVendor(${vendor.id})">Edit</button>
                    <button class="btn-link" onclick="Vendors.deleteVendor(${vendor.id})" style="color: #ef4444;">Delete</button>
                </td>
            </tr>
        `).join('');
    },

    editVendor(vendorId) {
        const vendor = App.state.vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        const content = `
            <form id="editVendorForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name</label>
                    <input type="text" name="name" value="${vendor.name}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                    <input type="email" name="email" value="${vendor.email}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone</label>
                    <input type="tel" name="phone" value="${vendor.phone}" required style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Save Changes</button>
            </form>
        `;

        Modal.open('Edit Vendor', content);

        setTimeout(() => {
            const form = document.getElementById('editVendorForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    vendor.name = formData.get('name');
                    vendor.email = formData.get('email');
                    vendor.phone = formData.get('phone');
                    App.saveToStorage();
                    this.renderVendors();
                    Modal.close();
                });
            }
        }, 100);
    },

    deleteVendor(vendorId) {
        if (confirm('Are you sure you want to delete this vendor?')) {
            App.state.vendors = App.state.vendors.filter(v => v.id !== vendorId);
            App.saveToStorage();
            this.renderVendors();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Vendors.init();
});
