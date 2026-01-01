import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MotionController } from '../lib/motion';

describe('MotionController', () => {
    let motionController: MotionController;

    beforeEach(() => {
        motionController = new MotionController();
        vi.useFakeTimers();
    });

    afterEach(() => {
        motionController.cleanup();
        vi.restoreAllMocks();
    });

    describe('Handle Registration', () => {
        it('should register handles under moduleId', () => {
            const updateFn = vi.fn();
            const handle = motionController.createRAFHandle('test-module', updateFn);

            expect(handle.play).toBeDefined();
            expect(handle.pause).toBeDefined();
            expect(handle.cancel).toBeDefined();

            handle.play?.();
            vi.advanceTimersByTime(100);
            expect(updateFn).toHaveBeenCalled();
        });

        it('should create WAAPI handles under moduleId', () => {
            const element = document.createElement('div');
            const handle = motionController.createInfiniteLoop(
                'test-module',
                element,
                [{ opacity: 0 }, { opacity: 1 }],
                { duration: 1000 }
            );
            expect(handle.element).toBe(element);
            expect(handle.play).toBeDefined();
        });
    });

    describe('Cleanup', () => {
        it('cleanupModule should cancel all handles for module', () => {
            const updateFn = vi.fn();
            motionController.createRAFHandle('test-module', updateFn);

            motionController.cleanupModule('test-module');

            updateFn.mockClear();
            vi.advanceTimersByTime(100);
            expect(updateFn).not.toHaveBeenCalled();
        });

        it('cleanup should be idempotent', () => {
            motionController.cleanup();
            expect(() => motionController.cleanup()).not.toThrow();
        });

        it('should remove all event listeners', () => {
            const addSpy = vi.spyOn(document, 'addEventListener');
            const removeSpy = vi.spyOn(document, 'removeEventListener');

            motionController.cleanup();

            expect(removeSpy).toHaveBeenCalled();
        });
    });

    describe('Resume Policy', () => {
        it('should not resume animations when reduced motion is active', () => {
            const element = document.createElement('div');
            const handle = motionController.createInfiniteLoop(
                'test-module',
                element,
                [{ opacity: 0 }, { opacity: 1 }],
                { duration: 1000 }
            );
            const playSpy = vi.spyOn(handle, 'play');

            motionController['prefersReducedMotion'] = true;
            motionController.playAllAnimations('test-module');

            expect(playSpy).not.toHaveBeenCalled();
        });
    });
});
