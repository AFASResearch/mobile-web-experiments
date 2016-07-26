import {h, VNode, Component} from 'maquette';
import {UserInfo} from '../interfaces';
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
  renderCell: (item: Item, columnKey: string) => VNode | string;
  rowClicked: (item: Item) => void;
}

export let createList = (config: ListConfig, bindings: ListBindings<UserInfo>): Component => {
  let {getItems, getKey, renderCell, rowClicked} = bindings;
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
          h('table', [
            h('thead', [
              h('tr', columns.map(c => h('th', [c.header])))
            ]),
            h('tbody', items.map(item =>
                h('tr', { key: getKey(item), onclick: handleClick, 'data-itemId': item.id }, [
                  columns.map(c => h('td', [renderCell(item, c.key)]))
                ])
            ))
          ])
        ] : [
            h('span', ['Loading...'])
          ]
      ]);
    }
  };
  return list;
};
