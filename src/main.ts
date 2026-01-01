import { initApp } from './lib/app';

function initialize() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}

initialize();
