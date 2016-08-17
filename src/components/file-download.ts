import {h} from 'maquette';
require('../styles/text.scss');

export let createFileDownload = () => {
  return {
    renderMaquette: () => {
      return h('div', [
        // instant download method - (using the HTML5 download attribute.)
        h('a', { download: 'pdf.pdf', href: 'images/pdf.pdf', title: 'imageName' }, ['download a fancy image']),
        h('hr')
      ]);
    }
  };
};
