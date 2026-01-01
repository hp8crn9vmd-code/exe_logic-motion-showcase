import type { MotionModule } from '../types';

export const radialLoaderModule: MotionModule = {
    id: 'radial-loader',
    title: 'Radial Loader',
    description: 'Concentric loading indicators with phase offset',
    category: 'UI',
    init: (container) => {
        container.innerHTML = `
            <div class="p-8 h-full flex items-center justify-center">
                <div class="relative w-32 h-32">
                    ${Array.from({ length: 3 }).map((_, i) => `
                        <div class="radial-loader absolute inset-0 m-auto w-${(i + 1) * 20} h-${(i + 1) * 20} border-t-accent dark:border-t-accent-dark animate-spin duration-${1000 + i * 300} delay-${i * 100}"></div>
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
