import type { MotionModule } from '../types';

export const binaryRainModule: MotionModule = {
    id: 'binary-rain',
    title: 'Binary Rain',
    description: 'Matrix-style falling binary digits',
    category: 'Typography',
    init: (container) => {
        container.innerHTML = `
            <div class="p-4 h-full relative overflow-hidden font-mono text-sm">
                <div class="absolute inset-0 flex justify-around">
                    ${Array.from({ length: 20 }).map(() => `
                        <div class="flex flex-col items-center">
                            ${Array.from({ length: 30 }).map(() => `
                                <span class="text-accent dark:text-accent-dark opacity-0 animate-rain duration-${500 + Math.random() * 1000}">${Math.random() > 0.5 ? '1' : '0'}</span>
                            `).join('')}
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
