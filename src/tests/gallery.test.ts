import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MotionGallery } from '../lib/gallery';
import { motionController } from '../lib/motion';

describe('MotionGallery', () => {
  let gallery: MotionGallery;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    gallery = new MotionGallery(container);
    vi.spyOn(motionController, 'cleanupModule').mockImplementation(() => {});
  });

  afterEach(() => {
    gallery.cleanup();
    vi.restoreAllMocks();
  });

  it('should register all 10 modules', () => {
    expect(gallery.getModules()).toHaveLength(10);
  });

  it('should initialize module with correct container', () => {
    gallery.renderModule('kinetic-typography');
    const moduleContainer = container.querySelector('[data-module]');
    expect(moduleContainer).not.toBeNull();
  });

  it('should cleanup module on destroy', () => {
    gallery.renderModule('kinetic-typography');
    gallery.destroyModule('kinetic-typography');
    expect(motionController.cleanupModule).toHaveBeenCalledWith('kinetic-typography');
  });
});
