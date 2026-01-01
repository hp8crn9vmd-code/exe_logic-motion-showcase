import { test, expect } from '@playwright/test';

test.describe('Motion Showcase', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load all 10 modules', async ({ page }) => {
        const modules = await page.locator('[data-module]').count();
        expect(modules).toBe(10);
    });

    test('should toggle theme', async ({ page }) => {
        const initialTheme = await page.evaluate(() =>
            document.documentElement.classList.contains('dark')
        );

        await page.click('button:has-text("Toggle Theme")');
        const newTheme = await page.evaluate(() =>
            document.documentElement.classList.contains('dark')
        );

        expect(newTheme).not.toBe(initialTheme);
    });

    test('should respect reduced motion preference', async ({ page }) => {
        await page.click('button:has-text("Toggle Motion")');

        const hasMotionDisabled = await page.evaluate(() =>
            document.documentElement.classList.contains('motion-disabled')
        );

        expect(hasMotionDisabled).toBe(true);
    });

    test('should have keyboard navigation', async ({ page }) => {
        await page.keyboard.press('Tab');

        const focusedElement = await page.evaluate(() =>
            document.activeElement?.tagName
        );

        expect(['BUTTON', 'A', 'INPUT'].includes(focusedElement || '')).toBe(true);
    });
});
