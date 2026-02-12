export function initHelpUI() {
    const helpBtn = document.getElementById('help-btn');
    const modal = document.getElementById('help-modal');
    const closeBtn = modal.querySelector('.close-modal');

    // Open Modal
    helpBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    console.log("Help UI Initialized");
}
