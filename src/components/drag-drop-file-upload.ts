import {h} from 'maquette';
require('../styles/drag-drop-file-upload.scss');

export interface DragDropFileUploadConfig {
}

export interface DragDropFileUploadBindings {
}

// browsers allow already by themselves to drag files on a input='file' element. 
export let createDragDropFileUpload = (config: DragDropFileUploadConfig, bindings: DragDropFileUploadBindings) => {

  return {
    renderMaquette: () => {
      return h('div', [
        h('input', { id: 'file-upload', type: 'file', name: 'file[]', multiple: true})
      ]);
    }
  };
};
