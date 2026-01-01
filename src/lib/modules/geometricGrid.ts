import type { MotionModule } from '../types';

export const geometricGridModule: MotionModule = {
    id: 'geometric-grid',
    title: 'Geometric Grid',
    description: 'Procedurally generated grid with cellular automata',
    category: 'Grid',
    init: (container) => {
        container.innerHTML = `
            <div class="p-4 h-full grid grid-cols-8 grid-rows-8 gap-1">
                ${Array.from({ length: 64 }).map((_, i) => `
                    <div class="geometric-cell delay-${(i % 8) * 50}"></div>
                `).join('')}
            </div>
        `;
        container.classList.add('animation-paused');
    },
    destroy: () => {
        // No cleanup needed
    }
};
