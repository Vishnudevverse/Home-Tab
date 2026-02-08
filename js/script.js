document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-bookmarks').addEventListener('click', () => chrome.tabs.create({ url: 'edge://favorites' }));
    document.getElementById('btn-downloads').addEventListener('click', () => chrome.tabs.create({ url: 'edge://downloads' }));
    document.getElementById('btn-extensions').addEventListener('click', () => chrome.tabs.create({ url: 'edge://extensions' }));
    document.getElementById('btn-history').addEventListener('click', () => chrome.tabs.create({ url: 'edge://history' }));
    document.getElementById('btn-settings').addEventListener('click', () => chrome.tabs.create({ url: 'edge://settings' }));

    function loadGameModule() {
        const loadGame = localStorage.getItem('gameload') || 'true';
        if (loadGame === 'true') {
            const sec = document.createElement('section');
            sec.className = 'main-right';
            sec.innerHTML = `
            <iframe 
            src="game/game-clock.html" 
            loading="lazy" 
            style="width: 100%; height: 400px; border: none; border-radius: var(--border-radius); margin: 0 auto;" 
            title="Dashboard Game Environment"
            frameborder="0">
            </iframe>`;
            document.querySelector('main').appendChild(sec);
            document.head.append(Object.assign(document.createElement('link'), {
                rel: 'stylesheet',
                href: 'css/game_resp.css'
            }));
        }
    }
    function nonBattery() {
        const loadGame = localStorage.getItem('nonBattery') || 'true';
        document.head.append(Object.assign(document.createElement('link'), {
            rel: 'stylesheet',
            href: 'css/nonbattery.css'
        }));
    }
    loadGameModule();
    nonBattery();
});
