import {Component, h} from 'maquette';
let styles = <any>require('./page.css');

export interface PageConfig {
    title: string | (() => string);
    backButton?: {
        title: string;
        route: string;
    };
    // Note: the body components should handle scrolling themselves
    body: Component[];
}

export let createPage = (config: PageConfig) => {
    let {title, body} = config;
    let page = {
        renderMaquette: () => {
            let renderTitle = typeof title === 'string' ? title : title();
            return h('div', { class: styles.page, key: page }, [
                h('div', { class: styles.header }, [
                    // backButton
                    h('span', [renderTitle])
                ]),
                h('div', { class: styles.body }, [
                    config.body.map(c => c.renderMaquette())
                ])
            ]);
        }
    };
    return page;
};
