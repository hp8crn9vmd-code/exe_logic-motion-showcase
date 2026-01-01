export type Theme = 'light' | 'dark';
export type MotionPreference = boolean; // true = reduced, false = normal

export interface MotionHandle {
    play?: () => void;
    pause?: () => void;
    cancel?: () => void;
    element?: HTMLElement;
}

export interface MotionModule {
    id: string;
    title: string;
    description: string;
    category: string;
    init: (container: HTMLElement) => void;
    pause?: () => void;
    play?: () => void;
    destroy?: () => void;
}
