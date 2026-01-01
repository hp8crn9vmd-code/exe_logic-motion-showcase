import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ThemeManager } from '../lib/theme';

describe('ThemeManager', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(window.matchMedia('(prefers-color-scheme: dark)'), 'matches', 'get').mockReturnValue(false);
        vi.spyOn(window.matchMedia('(prefers-reduced-motion: reduce)'), 'matches', 'get').mockReturnValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('System vs User Override Logic', () => {
        it('should default to system mode on first load', () => {
            const manager = new ThemeManager();
            expect(manager.getThemeMode()).toBe('system');
            expect(manager.getMotionMode()).toBe('system');
            expect(localStorage.getItem('theme-mode')).toBeNull();
        });

        it('should not write to localStorage in system mode', () => {
            const manager = new ThemeManager();
            const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            vi.spyOn(mediaQuery, 'matches', 'get').mockReturnValue(true);
            mediaQuery.dispatchEvent(new Event('change'));

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        it('should persist user choice when toggled', () => {
            const manager = new ThemeManager();
            manager.toggleTheme();

            expect(manager.getThemeMode()).toBe('user');
            expect(localStorage.getItem('theme-mode')).toBe('user');
            expect(localStorage.getItem('theme')).toBe('dark');
        });

        it('should respect system changes in system mode', () => {
            const manager = new ThemeManager();
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            vi.spyOn(mediaQuery, 'matches', 'get').mockReturnValue(true);
            mediaQuery.dispatchEvent(new Event('change'));

            expect(manager.getTheme()).toBe('dark');
        });

        it('should ignore system changes in user mode', () => {
            const manager = new ThemeManager();
            manager.toggleTheme();

            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            vi.spyOn(mediaQuery, 'matches', 'get').mockReturnValue(false);
            mediaQuery.dispatchEvent(new Event('change'));

            expect(manager.getTheme()).toBe('dark');
        });
    });

    describe('Reduced Motion Precedence', () => {
        it('should follow user > system > default precedence', () => {
            const manager = new ThemeManager();
            expect(manager.getMotionPreference()).toBe(false);
            manager.toggleMotion();
            expect(manager.getMotionPreference()).toBe(true);
            expect(manager.getMotionMode()).toBe('user');
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            vi.spyOn(mediaQuery, 'matches', 'get').mockReturnValue(false);
            mediaQuery.dispatchEvent(new Event('change'));
            expect(manager.getMotionPreference()).toBe(true);
        });
    });

    describe('Cleanup', () => {
        it('should cleanup media query listeners', () => {
            const manager = new ThemeManager();
            const abortSpy = vi.spyOn(manager['abortController'], 'abort');
            manager.cleanup();
            expect(abortSpy).toHaveBeenCalled();
            expect(manager['themeChangeCallbacks']).toHaveLength(0);
            expect(manager['motionChangeCallbacks']).toHaveLength(0);
        });
    });
});
