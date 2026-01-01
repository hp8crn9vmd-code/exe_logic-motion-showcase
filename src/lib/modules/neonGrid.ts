import type { MotionModule } from '../types';

export const neonGridModule: MotionModule = {
    id: 'neon-grid',
    title: 'Neon Grid',
    description: 'Retro-futuristic grid with glow effects',
    category: 'Grid',
    init: (container) => {
        container.innerHTML = `
            <div class="p-4 h-full grid grid-cols-6 grid-rows-6 gap-2">
                ${Array.from({ length: 36 }).map((_, i) => `
                    <div class="neon-cell delay-${(i % 6) * 100} duration-1000"></div>
                `).join('')}
            </div>
        `;
        container.classList.add('animation-paused');
    },
    destroy: () => {
        // No cleanup needed
    }
};
