import {h, VNode, Component} from 'maquette';
import {UserInfo, MessageInfo} from '../interfaces';
require('../styles/list.scss');

export interface ListColumn {
  key: string;
  header: string;
}

export interface ListConfig {
  columns: ListColumn[];
}

export interface ListBindings<Item> {
  getItems: () => Item[];
  getKey: (item: Item) => string | number;
  // renderCell: (item: Item, columnKey: string) => VNode | string;
  renderRow: (item: Item) => VNode | string;
  rowClicked?: (item: Item) => void;
}

export let createList = (config: ListConfig, bindings: ListBindings<UserInfo | MessageInfo>): Component => {
  let {getItems, getKey, renderRow, rowClicked} = bindings;
  let {columns} = config;

  let handleClick = (evt: Event) => {
    let items = getItems();
    let target = evt.currentTarget as HTMLElement;
    let id = target.getAttribute('data-itemId');
    let founditem = items.filter(item => item.id === id)[0];
    rowClicked(founditem);
  };

  let list = {
    renderMaquette: () => {
      let items = getItems();
      return h('div', { key: list, class: 'list' }, [
        items ? [
            h('container', items.map(item =>
                h('row', { key: getKey(item), onclick: handleClick, 'data-itemId': item.id }, [
                  renderRow(item)
                  // columns.map(c => h('p', [renderCell(item, c.key)]))
                ])
            ))
        ] : [
            h('span', ['Loading...'])
          ]
      ]);
    }
  };
  return list;
};
