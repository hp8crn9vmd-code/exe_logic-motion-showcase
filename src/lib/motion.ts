import type { MotionHandle } from './types';

export class MotionController {
    private observers: Map<string, IntersectionObserver> = new Map();
    private motionHandles: Map<string, MotionHandle[]> = new Map();
    private prefersReducedMotion: boolean;
    private visibilityObserver: IntersectionObserver;
    private resizeObservers: Map<string, ResizeObserver> = new Map();
    private cleanupCompleted = false;
    private abortController = new AbortController();
    private onVisibilityChange = () => {
        this.moduleContainers.forEach((container, moduleId) => {
            this.evaluateContainerPauseState(container, moduleId);
        });
    };
    private onReducedMotionChange = (e: MediaQueryListEvent) => {
        this.prefersReducedMotion = e.matches;
        this.moduleContainers.forEach((container, moduleId) => {
            this.evaluateContainerPauseState(container, moduleId);
        });
    };
    private boundCleanup = this.cleanup.bind(this);
    private reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    private moduleContainers: Map<string, HTMLElement> = new Map();
    private intersectionStates: Map<string, boolean> = new Map();

    constructor() {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.visibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const target = entry.target as HTMLElement;
                    const moduleId = target.dataset.module;
                    if (!moduleId) return;

                    // Update intersection state
                    this.intersectionStates.set(moduleId, entry.isIntersecting);

                    // Apply pause/play based on all conditions
                    this.evaluateContainerPauseState(target, moduleId);
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        this.setupGlobalListeners();
    }

    private setupGlobalListeners(): void {
        const signal = this.abortController.signal;

        document.addEventListener('visibilitychange', this.onVisibilityChange, { signal });
        this.reducedMotionQuery.addEventListener('change', this.onReducedMotionChange, { signal });

        window.addEventListener('pagehide', this.boundCleanup, { signal });
        window.addEventListener('beforeunload', this.boundCleanup, { signal });
    }

    private evaluateContainerPauseState(container: HTMLElement, moduleId: string): void {
        const isIntersecting = this.intersectionStates.get(moduleId) || false;
        const shouldPause = !isIntersecting || document.hidden || this.prefersReducedMotion;

        if (shouldPause) {
            container.classList.add('animation-paused');
            this.pauseAllAnimations(moduleId);
        } else {
            container.classList.remove('animation-paused');
            this.playAllAnimations(moduleId);
        }
    }

    createInfiniteLoop(
        moduleId: string,
        element: HTMLElement,
        keyframes: Keyframe[] | PropertyIndexedKeyframes,
        options: KeyframeAnimationOptions
    ): MotionHandle {
        const animation = element.animate(keyframes, {
            ...options,
            iterations: Infinity
        });
        if (this.prefersReducedMotion) {
            animation.pause();
        }
        const handle: MotionHandle = {
            play: () => animation.play(),
            pause: () => animation.pause(),
            cancel: () => animation.cancel(),
            element
        };
        this.registerMotionHandle(moduleId, handle);
        return handle;
    }

    createRAFHandle(
        moduleId: string,
        updateFn: () => void,
        startImmediately = true
    ): MotionHandle {
        let animationId: number | null = null;

        const handle: MotionHandle = {
            play: () => {
                if (!animationId && !this.prefersReducedMotion) {
                    const loop = () => {
                        updateFn();
                        animationId = requestAnimationFrame(loop);
                    };
                    animationId = requestAnimationFrame(loop);
                }
            },
            pause: () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            },
            cancel: () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        };

        this.registerMotionHandle(moduleId, handle);

        if (startImmediately && !this.prefersReducedMotion) {
            handle.play?.();
        }

        return handle;
    }

    observeElementForPausing(element: HTMLElement, moduleId: string): void {
        element.dataset.module = moduleId;
        this.visibilityObserver.observe(element);
        this.moduleContainers.set(moduleId, element);
        this.intersectionStates.set(moduleId, false); // Initial state
    }

    registerResizeObserver(element: HTMLElement, moduleId: string, callback: () => void): void {
        const observer = new ResizeObserver(callback);
        observer.observe(element);
        this.resizeObservers.set(`${moduleId}-resize`, observer);
    }

    registerMotionHandle(moduleId: string, handle: MotionHandle): void {
        if (!this.motionHandles.has(moduleId)) {
            this.motionHandles.set(moduleId, []);
        }
        this.motionHandles.get(moduleId)!.push(handle);
    }

    pauseAllAnimations(moduleId?: string): void {
        if (moduleId) {
            const handles = this.motionHandles.get(moduleId);
            if (handles) {
                handles.forEach(handle => handle.pause?.());
            }
        } else {
            this.motionHandles.forEach(handles => {
                handles.forEach(handle => handle.pause?.());
            });
        }
    }

    playAllAnimations(moduleId?: string): void {
        if (moduleId) {
            const handles = this.motionHandles.get(moduleId);
            if (handles && !this.prefersReducedMotion) {
                handles.forEach(handle => handle.play?.());
            }
        } else {
            if (!this.prefersReducedMotion) {
                this.motionHandles.forEach(handles => {
                    handles.forEach(handle => handle.play?.());
                });
            }
        }
    }

    cleanupModule(moduleId: string): void {
        const handles = this.motionHandles.get(moduleId);
        if (handles) {
            handles.forEach(handle => handle.cancel?.());
            this.motionHandles.delete(moduleId);
        }

        const container = this.moduleContainers.get(moduleId);
        if (container) {
            this.visibilityObserver.unobserve(container);
            this.moduleContainers.delete(moduleId);
        }

        this.intersectionStates.delete(moduleId);

        const resizeObserver = this.resizeObservers.get(`${moduleId}-resize`);
        if (resizeObserver) {
            resizeObserver.disconnect();
            this.resizeObservers.delete(`${moduleId}-resize`);
        }
    }

    cleanup(): void {
        if (this.cleanupCompleted) return;

        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.visibilityObserver.disconnect();

        this.resizeObservers.forEach(observer => observer.disconnect());
        this.resizeObservers.clear();

        this.motionHandles.forEach(handles => {
            handles.forEach(handle => handle.cancel?.());
        });
        this.motionHandles.clear();

        this.moduleContainers.clear();
        this.intersectionStates.clear();

        // Explicitly remove listeners (needed for deterministic unit tests)
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        this.reducedMotionQuery.removeEventListener('change', this.onReducedMotionChange);
        window.removeEventListener('pagehide', this.boundCleanup);
        window.removeEventListener('beforeunload', this.boundCleanup);

        this.abortController.abort();
        this.cleanupCompleted = true;
    }
}

export const motionController = new MotionController();
