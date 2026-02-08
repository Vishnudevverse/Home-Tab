const themeManager = (() => {
    const script = document.currentScript || document.querySelector('script[data-filename]');
    const CSS_URL = script?.dataset.filename;
    const LINK_ID = 'darkcssfile';

    const getLink = () => document.getElementById(LINK_ID);

    const toggleDarkSheet = (shouldAdd) => {
        const existingLink = getLink();
        if (shouldAdd && !existingLink) {
            const link = Object.assign(document.createElement('link'), {
                rel: 'stylesheet',
                id: LINK_ID,
                href: CSS_URL
            });
            document.head.appendChild(link);
        } else if (!shouldAdd && existingLink) {
            existingLink.remove();
        }
    };

    const applyTheme = () => {
        const theme = Number(localStorage.getItem('usertheme')) || 0;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (theme === 2 || (theme === 0 && systemDark)) {
            toggleDarkSheet(true);
        } else {
            toggleDarkSheet(false);
        }
    };
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
            if ((Number(localStorage.getItem('usertheme')) || 0) === 0) applyTheme();
        });

    return { init: applyTheme };
})();

themeManager.init();