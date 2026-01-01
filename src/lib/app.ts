import { themeManager } from './theme';
import { motionController } from './motion';
import { MotionGallery } from './gallery';

let gallery: MotionGallery | null = null;

function updateThemeUI(): void {
    const theme = themeManager.getTheme();
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (themeIcon && themeText) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

function updateMotionUI(): void {
    const motionPreference = themeManager.getMotionPreference();
    const motionIcon = document.getElementById('motion-icon');
    const motionText = document.getElementById('motion-text');
    
    if (motionIcon && motionText) {
        motionIcon.textContent = motionPreference ? '🐌' : '⚡';
        motionText.textContent = motionPreference ? 'Normal Motion' : 'Reduced Motion';
    }
}

function setupUIListeners(): void {
    const themeToggle = document.getElementById('theme-toggle');
    const motionToggle = document.getElementById('motion-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
            updateThemeUI();
        });
    }
    
    if (motionToggle) {
        motionToggle.addEventListener('click', () => {
            themeManager.toggleMotion();
            updateMotionUI();
        });
    }
    
    // Update UI initially
    updateThemeUI();
    updateMotionUI();
}

export function initApp(): void {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) {
        console.error('Gallery container not found');
        return;
    }

    gallery = new MotionGallery(galleryContainer);
    setupUIListeners();

    window.addEventListener('pagehide', cleanup);
    window.addEventListener('beforeunload', cleanup);
}

function cleanup(): void {
    if (gallery) {
        gallery.cleanup();
        gallery = null;
    }
    themeManager.cleanup();
    motionController.cleanup();
}
