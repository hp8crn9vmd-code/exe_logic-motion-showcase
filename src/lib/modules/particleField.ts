import { motionController } from '../motion';
import type { MotionModule } from '../types';

export const particleFieldModule: MotionModule = {
    id: 'particle-field',
    title: 'Particle Physics Field',
    description: 'Brownian motion simulation with velocity vectors',
    category: 'Physics',
    init: (container) => {
        container.innerHTML = `
            <div class="p-4 h-full relative overflow-hidden" id="particle-container"></div>
        `;

        const particleCount = 30;
        const particles: Array<{
            el: HTMLDivElement;
            x: number;
            y: number;
            vx: number;
            vy: number;
        }> = [];

        const containerEl = container.querySelector('#particle-container') as HTMLElement;
        if (!containerEl) return;

        containerEl.classList.add('relative', 'w-full', 'h-full');

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-accent dark:bg-accent-dark rounded-full will-change-transform opacity-60';
            containerEl.appendChild(particle);

            particles.push({
                el: particle,
                x: Math.random() * 100,
                y: Math.random() * 100,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }

        const updateParticles = () => {
            const { width, height } = containerEl.getBoundingClientRect();

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
            });
        };

        motionController.createRAFHandle('particle-field', updateParticles);

        motionController.registerResizeObserver(containerEl, 'particle-field', () => {
            particles.forEach(p => {
                p.x = Math.random() * containerEl.clientWidth;
                p.y = Math.random() * containerEl.clientHeight;
            });
        });
    },
    pause: () => motionController.pauseAllAnimations('particle-field'),
    play: () => motionController.playAllAnimations('particle-field'),
    destroy: () => motionController.cleanupModule('particle-field')
};
