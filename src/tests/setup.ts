import { vi } from 'vitest';

// Polyfill matchMedia for JSDOM (cached per query + listener-aware)
type MqlListener = (e: MediaQueryListEvent) => void;

const __mqlCache: Record<string, MediaQueryList> =
  ((globalThis as any).__mqlCache ||= {});

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => {
    if (__mqlCache[query]) return __mqlCache[query];

    const listeners = new Set<MqlListener>();

    const mql: any = {
      media: query,
      matches: false,
      onchange: null,

      addEventListener: vi.fn((_type: string, cb: MqlListener) => {
        listeners.add(cb);
      }),
      removeEventListener: vi.fn((_type: string, cb: MqlListener) => {
        listeners.delete(cb);
      }),

      // Deprecated APIs (some libs/tests still call these)
      addListener: vi.fn((cb: MqlListener) => {
        listeners.add(cb);
      }),
      removeListener: vi.fn((cb: MqlListener) => {
        listeners.delete(cb);
      }),

      dispatchEvent: vi.fn((event: Event) => {
        // Provide a MediaQueryListEvent-like object with matches/media
        const evt: any = { ...event, matches: mql.matches, media: query };
        listeners.forEach((cb) => cb(evt));
        if (typeof mql.onchange === 'function') mql.onchange(evt);
        return true;
      }),
    };

    __mqlCache[query] = mql as MediaQueryList;
    return __mqlCache[query];
  }) as unknown as typeof window.matchMedia;
}

// Polyfill IntersectionObserver for JSDOM
if (!(globalThis as any).IntersectionObserver) {
  class MockIntersectionObserver {
    private callback: IntersectionObserverCallback;

    constructor(cb: IntersectionObserverCallback) {
      this.callback = cb;
    }

    observe(target: Element) {
      this.callback(
        [
          {
            isIntersecting: true,
            target,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ],
        this as unknown as IntersectionObserver
      );
    }

    unobserve(_target: Element) {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  (globalThis as any).IntersectionObserver = MockIntersectionObserver as any;
}

// Polyfill Web Animations API (WAAPI) for JSDOM: Element.prototype.animate
if (!(Element.prototype as any).animate) {
  (Element.prototype as any).animate = function () {
    const animation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      finish: vi.fn(),
      reverse: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      // commonly used properties
      currentTime: 0,
      playbackRate: 1,
      playState: 'running',
      finished: Promise.resolve(),
      effect: null,
      timeline: null,
    };
    return animation;
  };
}

// Polyfill ResizeObserver for JSDOM
if (!(globalThis as any).ResizeObserver) {
  class MockResizeObserver {
    private callback: ResizeObserverCallback;

    constructor(cb: ResizeObserverCallback) {
      this.callback = cb;
    }

    observe(target: Element) {
      // Trigger once immediately
      this.callback(
        [
          {
            target,
            contentRect: target.getBoundingClientRect(),
          } as unknown as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver
      );
    }

    unobserve(_target: Element) {}
    disconnect() {}
  }

  (globalThis as any).ResizeObserver = MockResizeObserver as any;
}
