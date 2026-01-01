import { motionController } from '../motion';
import type { MotionModule } from '../types';

export const svgStrokeModule: MotionModule = {
    id: 'svg-stroke',
    title: 'SVG Stroke Animation',
    description: 'Vector path drawing with dasharray animation',
    category: 'Vector',
    init: (container) => {
        container.innerHTML = `
            <div class="p-8 h-full flex items-center justify-center">
                <svg class="w-48 h-48" viewBox="0 0 100 100">
                    <path
                        class="stroke-accent dark:stroke-accent-dark stroke-[0.5] fill-none"
                        d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z"
                        stroke-dasharray="300"
                        stroke-dashoffset="300"
                    />
                </svg>
            </div>
        `;

        const path = container.querySelector('path');
        if (!path) return;

        motionController.createInfiniteLoop(
            'svg-stroke',
            path as unknown as HTMLElement,
            [
                { strokeDashoffset: '300' },
                { strokeDashoffset: '0' }
            ],
            {
                duration: 2000,
                easing: 'ease-in-out'
            }
        );
    },
    pause: () => motionController.pauseAllAnimations('svg-stroke'),
    play: () => motionController.playAllAnimations('svg-stroke'),
    destroy: () => motionController.cleanupModule('svg-stroke')
};
