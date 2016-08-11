import {h, VNode, Component} from 'maquette';
import {UserInfo, MessageInfo} from '../interfaces';
require('../styles/list.scss');

export interface ListColumn {
  key: string;
  header: string;
}

export interface ListConfig {
  className: string;
}

export interface ListBindings<Item> {
  getItems: () => Item[];
  getKey: (item: Item) => string | number;
  renderHeader?: () => VNode | string;
  renderRow: (item: Item) => VNode | string;
  renderFooter?: () => VNode | string;
  rowClicked?: (item: Item) => void;
}

export let createList = (config: ListConfig, bindings: ListBindings<UserInfo | MessageInfo>): Component => {
  let {getItems, getKey, renderHeader, renderRow, renderFooter, rowClicked} = bindings;
  let {className} = config;

  let handleClick = (evt: Event) => {
    let items = getItems();
    let target = evt.currentTarget as HTMLElement;
    let id = target.getAttribute('data-itemId');
    let founditem = items.filter(item => item.id === id)[0];
    if (rowClicked) { // if function is defined
      rowClicked(founditem);
    };
  };

  let list = {
    renderMaquette: () => {
      let items = getItems();

      return h('div', { class: className ? className : undefined, key: className ? className : undefined  }, [
        renderHeader ? renderHeader() : undefined,
        h('div', { key: list, class: 'listHolder' }, [

        h('div', { key: list, class: 'list' }, [
          items ? [
            h('div', {id: 'chatContainer', key: list}, items.map(item =>
              h('div', { key: getKey(item), onclick: handleClick, 'data-itemId': item.id }, [
                renderRow(item)
              ])
            ))
          ] : [
            h('span', ['Loading...'])
          ]
          ])
        ]),
        renderFooter ? renderFooter() : undefined
      ]);
    }
  };
  return list;
};
