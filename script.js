function openLink(url) {
    chrome.tabs.create({ url: url });
}

document.getElementById('btn-bookmarks').addEventListener('click', () => openLink('edge://favorites'));
document.getElementById('btn-downloads').addEventListener('click', () => openLink('edge://downloads'));
document.getElementById('btn-extensions').addEventListener('click', () => openLink('edge://extensions'));
document.getElementById('btn-history').addEventListener('click', () => openLink('edge://history'));
document.getElementById('btn-settings').addEventListener('click', () => openLink('edge://settings'));