import { motionController } from './motion';
import { kineticTypographyModule } from './modules/kineticTypography';
import { svgStrokeModule } from './modules/svgStroke';
import { geometricGridModule } from './modules/geometricGrid';
import { waveGeneratorModule } from './modules/waveGenerator';
import { particleFieldModule } from './modules/particleField';
import { moirePatternModule } from './modules/moirePattern';
import { neonGridModule } from './modules/neonGrid';
import { binaryRainModule } from './modules/binaryRain';
import { radialLoaderModule } from './modules/radialLoader';
import { infiniteScrollModule } from './modules/infiniteScroll';
import type { MotionModule } from './types';

export class MotionGallery {
    private container: HTMLElement;
    private modules: Map<string, MotionModule> = new Map();
    private activeModules: Set<string> = new Set();

    constructor(container: HTMLElement) {
        this.container = container;
        this.registerAllModules();
        this.renderGallery();
    }

    private registerAllModules(): void {
        this.registerModule(kineticTypographyModule);
        this.registerModule(svgStrokeModule);
        this.registerModule(geometricGridModule);
        this.registerModule(waveGeneratorModule);
        this.registerModule(particleFieldModule);
        this.registerModule(moirePatternModule);
        this.registerModule(neonGridModule);
        this.registerModule(binaryRainModule);
        this.registerModule(radialLoaderModule);
        this.registerModule(infiniteScrollModule);
    }

    private registerModule(module: MotionModule): void {
        this.modules.set(module.id, module);
    }

    private renderGallery(): void {
        this.container.innerHTML = '';
        this.container.className = 'swiss-grid';

        this.modules.forEach((module, id) => {
            const moduleElement = this.createModuleElement(module);
            this.container.appendChild(moduleElement);
            this.renderModule(id);
        });
    }

    private createModuleElement(module: MotionModule): HTMLElement {
        const element = document.createElement('div');
        element.className = 'module-container col-span-12 md:col-span-6 lg:col-span-4';
        element.dataset.module = module.id;
        return element;
    }

    renderModule(moduleId: string): void {
        const module = this.modules.get(moduleId);
        const container = this.container.querySelector(`[data-module="${moduleId}"]`);

        if (!module || !container) return;

        module.init(container as HTMLElement);
        motionController.observeElementForPausing(container as HTMLElement, moduleId);
        this.activeModules.add(moduleId);
    }

    destroyModule(moduleId: string): void {
        const module = this.modules.get(moduleId);
        if (module?.destroy) {
            module.destroy();
        }
        motionController.cleanupModule(moduleId);
        this.activeModules.delete(moduleId);
    }

    getModules(): MotionModule[] {
        return Array.from(this.modules.values());
    }

    cleanup(): void {
        this.activeModules.forEach(moduleId => {
            this.destroyModule(moduleId);
        });
        this.activeModules.clear();
    }
}
