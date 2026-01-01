import type { MotionModule } from '../types';

export const kineticTypographyModule: MotionModule = {
    id: 'kinetic-typography',
    title: 'Kinetic Typography',
    description: 'Baseline-aligned letter animations with precise timing',
    category: 'Typography',
    init: (container) => {
        container.innerHTML = `
            <div class="p-8 h-full flex items-center justify-center">
                <div class="text-center">
                    <div class="text-4xl font-bold tracking-tighter overflow-hidden">
                        <span class="kinetic-letter delay-50">S</span>
                        <span class="kinetic-letter delay-100">W</span>
                        <span class="kinetic-letter delay-150">I</span>
                        <span class="kinetic-letter delay-200">S</span>
                        <span class="kinetic-letter delay-250">S</span>
                    </div>
                    <div class="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        <span class="animate-fade-in delay-300">Precision Type</span>
                    </div>
                </div>
            </div>
        `;
        container.classList.add('animation-paused');
    },
    destroy: () => {
        // No cleanup needed for this module
    }
};
