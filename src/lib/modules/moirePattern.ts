import type { MotionModule } from '../types';

export const moirePatternModule: MotionModule = {
    id: 'moire-pattern',
    title: 'Moire Pattern',
    description: 'Interference patterns from rotating concentric circles',
    category: 'Optical',
    init: (container) => {
        container.innerHTML = `
            <div class="p-8 h-full flex items-center justify-center">
                <div class="relative w-48 h-48">
                    ${Array.from({ length: 8 }).map((_, i) => `
                        <div class="moire-ring absolute inset-0 m-auto w-${(i + 1) * 6} h-${(i + 1) * 6} animate-spin duration-${1000 + (i * 200)} direction-${i % 2 === 0 ? 'normal' : 'reverse'}"></div>
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
