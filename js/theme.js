const LINK_ID = 'dark-theme-link';
function applyTheme() {
    const userChoice = parseInt(localStorage.getItem('usertheme')) || 0;
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = (userChoice === 2) || (userChoice === 0 && isSystemDark);

    const darkSheet = document.getElementById(LINK_ID);
    if (darkSheet) {
        darkSheet.disabled = !shouldBeDark;
    }
}
window.addEventListener('storage', (e) => {
    if (e.key === 'usertheme') {
        applyTheme();
    }
});
applyTheme();
