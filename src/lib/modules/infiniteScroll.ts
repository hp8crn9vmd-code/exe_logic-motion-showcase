import type { MotionModule } from '../types';

export const infiniteScrollModule: MotionModule = {
    id: 'infinite-scroll',
    title: 'Infinite Scroll',
    description: 'Seamlessly looping content with parallax layers',
    category: 'UI',
    init: (container) => {
        container.innerHTML = `
            <div class="p-4 h-full relative overflow-hidden">
                <div class="absolute inset-0 flex flex-col items-center space-y-8 animate-scroll">
                    ${Array.from({ length: 10 }).map((_, i) => `
                        <div class="w-48 h-12 bg-accent/10 dark:bg-accent-dark/10 rounded-lg flex items-center justify-center">
                            <span class="text-accent dark:text-accent-dark">Item ${i + 1}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.classList.add('animation-paused');
    },
    destroy: () => {
        // No cleanup needed
    }
};
