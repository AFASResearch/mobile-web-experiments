import {h, VNode} from 'maquette';
let styles = <any>require('./list.css');

export interface MainMenuEntry {
    key: string;
    title: string;
}

export interface MainMenuConfig {
    entries: MainMenuEntry[];
}

export interface MainMenuBindings {
    onClick(entry: MainMenuEntry): void;
}

export let createMainMenu = (config: MainMenuConfig, bindings: MainMenuBindings) => {
    return {
        renderMaquette: () => {
            return h('div', { class: styles.mainMenu }, [
                'MAIN MENU'
            ]);
        }
    }
}
