import type { Theme, MotionPreference } from './types';

type ThemeMode = 'system' | 'user';
type MotionMode = 'system' | 'user';

export class ThemeManager {
    private themeMode: ThemeMode = 'system';
    private motionMode: MotionMode = 'system';
    private currentTheme: Theme = 'light';
    private currentMotion: MotionPreference = false;

    private themeChangeCallbacks: Array<(theme: Theme) => void> = [];
    private motionChangeCallbacks: Array<(motion: MotionPreference) => void> = [];
    private mediaQueryListeners: Array<() => void> = [];
    private abortController = new AbortController();

    constructor() {
        const storedThemeMode = localStorage.getItem('theme-mode') as ThemeMode | null;
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const storedMotionMode = localStorage.getItem('motion-mode') as MotionMode | null;
        const storedMotion = localStorage.getItem('motion') as string | null;

        this.themeMode = storedThemeMode || 'system';
        if (storedTheme && this.themeMode === 'user') {
            this.currentTheme = storedTheme;
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = systemPrefersDark ? 'dark' : 'light';
        }

        this.motionMode = storedMotionMode || 'system';
        if (storedMotion && this.motionMode === 'user') {
            this.currentMotion = storedMotion === 'reduced';
        } else {
            const systemPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.currentMotion = systemPrefersReduced;
        }
        this.applyTheme();
        this.applyMotionPreference();
        this.setupMediaQueryListeners();
    }

    private setupMediaQueryListeners(): void {
        const signal = this.abortController.signal;

        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const themeListener = (e: MediaQueryListEvent) => {
            if (this.themeMode === 'system') {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
                this.notifyThemeChange();
            }
        };
        themeMediaQuery.addEventListener('change', themeListener, { signal });

        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const motionListener = (e: MediaQueryListEvent) => {
            if (this.motionMode === 'system') {
                this.currentMotion = e.matches;
                this.applyMotionPreference();
                this.notifyMotionChange();
            }
        };
        motionMediaQuery.addEventListener('change', motionListener, { signal });

        this.mediaQueryListeners.push(
            () => themeMediaQuery.removeEventListener('change', themeListener),
            () => motionMediaQuery.removeEventListener('change', motionListener)
        );
    }

    private applyTheme(): void {
        if (this.currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    private applyMotionPreference(): void {
        if (this.currentMotion) {
            document.documentElement.classList.add('motion-disabled');
        } else {
            document.documentElement.classList.remove('motion-disabled');
        }
    }

    toggleTheme(): void {
        this.themeMode = 'user';
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

        localStorage.setItem('theme-mode', 'user');
        localStorage.setItem('theme', this.currentTheme);

        this.applyTheme();
        this.notifyThemeChange();
    }

    toggleMotion(): void {
        this.motionMode = 'user';
        this.currentMotion = !this.currentMotion;

        localStorage.setItem('motion-mode', 'user');
        localStorage.setItem('motion', this.currentMotion ? 'reduced' : 'normal');

        this.applyMotionPreference();
        this.notifyMotionChange();
    }

    getTheme(): Theme {
        return this.currentTheme;
    }

    getThemeMode(): ThemeMode {
        return this.themeMode;
    }

    getMotionPreference(): boolean {
        return this.currentMotion;
    }

    getMotionMode(): MotionMode {
        return this.motionMode;
    }

    onThemeChange(callback: (theme: Theme) => void): () => void {
        this.themeChangeCallbacks.push(callback);
        return () => {
            const index = this.themeChangeCallbacks.indexOf(callback);
            if (index > -1) this.themeChangeCallbacks.splice(index, 1);
        };
    }

    onMotionChange(callback: (motion: MotionPreference) => void): () => void {
        this.motionChangeCallbacks.push(callback);
        return () => {
            const index = this.motionChangeCallbacks.indexOf(callback);
            if (index > -1) this.motionChangeCallbacks.splice(index, 1);
        };
    }

    private notifyThemeChange(): void {
        this.themeChangeCallbacks.forEach(callback => callback(this.currentTheme));
    }

    private notifyMotionChange(): void {
        this.motionChangeCallbacks.forEach(callback => callback(this.currentMotion));
    }

    cleanup(): void {
        this.abortController.abort();
        this.themeChangeCallbacks = [];
        this.motionChangeCallbacks = [];
        this.mediaQueryListeners.forEach(cleanup => cleanup());
        this.mediaQueryListeners = [];
    }
}

export const themeManager = new ThemeManager();
