import { themeManager } from './theme';
import { motionController } from './motion';
import { MotionGallery } from './gallery';

let gallery: MotionGallery | null = null;

export function initApp(): void {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) {
    console.error('Gallery container not found');
    return;
  }

  gallery = new MotionGallery(galleryContainer);

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
