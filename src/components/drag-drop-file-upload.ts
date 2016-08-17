/*
* This component creates an input, which uses the HTML5 standard.
* due to the custom styling it is easy to drag and drop.
* Normally drag and drop is supported if you drag the file on to the button. (but that is not very clear to users)
*/

import {h} from 'maquette';
require('../styles/drag-drop-file-upload.scss');

export let createDragDropFileUpload = () => {
  return {
    renderMaquette: () => {
      return h('div', [
        // browsers allow already by themselves to drag files on a input='file' element.
        h('input', { id: 'file-upload', type: 'file', name: 'file[]', multiple: true})
      ]);
    }
  };
};
