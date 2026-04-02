const Navigation = {
    init() {
        this.setupNavigation();
    },

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');

        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const viewName = e.currentTarget.dataset.view;
                this.switchView(viewName);
            });
        });
    },

    switchView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}-view`);
        const targetButton = document.querySelector(`[data-view="${viewName}"]`);

        if (targetView) {
            targetView.classList.add('active');
        }

        if (targetButton) {
            targetButton.classList.add('active');
        }

        App.state.currentView = viewName;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});
