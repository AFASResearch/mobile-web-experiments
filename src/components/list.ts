import {h, VNode, Component} from 'maquette';
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
}

export let createList = (config: ListConfig, bindings: ListBindings<Object>): Component => {
  let {getItems, getKey, renderCell} = bindings;
  let {columns} = config;

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
              h('tr', { key: getKey(item) }, [
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
