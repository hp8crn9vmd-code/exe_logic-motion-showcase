import { test, expect } from '@playwright/test';

test.describe('Motion Showcase', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // انتظار تحميل التطبيق
        await page.waitForSelector('[data-module]', { timeout: 10000 });
    });

    test('should load all 10 modules', async ({ page }) => {
        const modules = await page.locator('[data-module]').count();
        expect(modules).toBe(10);
    });

    test('should toggle theme', async ({ page }) => {
        const initialTheme = await page.evaluate(() =>
            document.documentElement.classList.contains('dark')
        );

        await page.click('#theme-toggle');
        const newTheme = await page.evaluate(() =>
            document.documentElement.classList.contains('dark')
        );

        expect(newTheme).not.toBe(initialTheme);
        
        // التحقق من تحديث نص الزر
        const buttonText = await page.textContent('#theme-text');
        expect(buttonText).toBe(initialTheme ? 'Light Mode' : 'Dark Mode');
    });

    test('should respect reduced motion preference', async ({ page }) => {
        const initialMotionDisabled = await page.evaluate(() =>
            document.documentElement.classList.contains('motion-disabled')
        );
        
        await page.click('#motion-toggle');
        
        const newMotionDisabled = await page.evaluate(() =>
            document.documentElement.classList.contains('motion-disabled')
        );

        expect(newMotionDisabled).not.toBe(initialMotionDisabled);
        
        // التحقق من تحديث نص الزر
        const buttonText = await page.textContent('#motion-text');
        expect(buttonText).toBe(initialMotionDisabled ? 'Normal Motion' : 'Reduced Motion');
    });

    test('should have keyboard navigation', async ({ page }) => {
        // التركيز على أول زر
        await page.focus('#theme-toggle');
        
        const focusedElement = await page.evaluate(() =>
            document.activeElement?.id
        );

        // يجب أن يكون التركيز على زر الثيم
        expect(focusedElement).toBe('theme-toggle');
        
        // التنقل بين الأزرار باستخدام Tab
        await page.keyboard.press('Tab');
        const secondFocusedElement = await page.evaluate(() =>
            document.activeElement?.id
        );
        expect(secondFocusedElement).toBe('motion-toggle');
        
        // تفعيل الزر باستخدام Space
        await page.keyboard.press('Space');
        const motionDisabled = await page.evaluate(() =>
            document.documentElement.classList.contains('motion-disabled')
        );
        expect(motionDisabled).toBe(true);
    });
});
