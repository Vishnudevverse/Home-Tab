const filename = document.currentScript.dataset.filename;
function themeSet() {
    let theme = Number(localStorage.getItem('usertheme')) || 0;
    const existingLink = document.getElementById('darkcssfile');
    console.log(theme);
    switch (theme) {
        case 1:
            if (existingLink)
                existingLink.remove();
            break;
        case 2:
            if (!existingLink) appendDarkCSS();
            break;
        case 0:
        default:
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark && !existingLink) {
                appendDarkCSS();
            } else if (!prefersDark && existingLink) {
                existingLink.remove();
            }
            break;
    }
}
function appendDarkCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = filename;
    link.id = 'darkcssfile';
    document.head.appendChild(link)
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const themepref = Number(localStorage.getItem('usertheme')) || 0;
    if (themepref === 0) {
        themeSet();
    }
});
themeSet();