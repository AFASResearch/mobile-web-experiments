import {h, VNode} from 'maquette';
let styles = <any>require('./list.css');

export interface ListColumn {
  key: string;
  header: string;
}

export interface ListConfig {
  columns: ListColumn[];
}

export interface ListBindings<Item> {
  getItems: () => Item[];
  getKey: (item: Item) => string|number;
  renderCell: (item: Item, columnKey: string) => VNode|string;
}

export let createList = (config: ListConfig, bindings: ListBindings<Object>) => {
  let {getItems, getKey, renderCell} = bindings;
  let {columns} = config;

  return {
    renderMaquette: () => {
      let items = getItems();
      if (!items) {
        return h('span', ['Loading...']);
      }
      return h('table', {class: styles.list}, [
        h('thead', [
          h('tr', columns.map(c => h('th', [c.header])))
        ]),
        h('tbody', items.map(item =>
          h('tr', {key: getKey(item)}, [
            columns.map(c => h('td', [renderCell(item, c.key)]))
          ])
        ))
      ]);
    }
  }
};
