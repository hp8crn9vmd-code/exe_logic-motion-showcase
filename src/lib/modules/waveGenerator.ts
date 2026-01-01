import type { MotionModule } from '../types';

export const waveGeneratorModule: MotionModule = {
    id: 'wave-generator',
    title: 'Wave Generator',
    description: 'Sine wave superposition with interference patterns',
    category: 'Physics',
    init: (container) => {
        container.innerHTML = `
            <div class="p-4 h-full relative overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                    ${Array.from({ length: 5 }).map((_, i) => `
                        <div class="absolute w-32 h-32 border-2 border-accent/30 dark:border-accent-dark/30 rounded-full opacity-20 animate-wave delay-${i * 100}"></div>
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
