/*
* This component creates an input, which uses the HTML5 standard.
* due to the custom styling it is easy to drag and drop.
* Normally drag and drop is supported if you drag the file on to the button. (but that is not very clear to users)
*/

import {h} from 'maquette';
require('../styles/drag-drop-file-upload.scss');
declare let window: any; 
let electronIsSupported: boolean = false;
export let createDragDropFileUpload = () => {


  if (typeof window.require !== 'undefined') {
    electronIsSupported = true; 
  }

let openHomeFolderOnClick = () => { 
  // code to retrieve the electron variable
  // we can also acces node js libraries
  let electron = window.require('electron'); 
  const shell = electron.shell; 
  let os = window.require('os'); 
  let fs = window.require('fs');  // https://nodejs.org/api/fs.html

  // shell.showItemInFolder(os.homedir());

  console.log('fs: ', fs);
  console.log(fs.readdirSync(os.homedir()));

  console.log(electron);
  console.log(electron.remote);
}

  return {
    renderMaquette: () => {
      return h('div', [
        // browsers allow already by themselves to drag files on a input='file' element.
        h('input', { id: 'file-upload', type: 'file', name: 'file[]', multiple: true}),
        electronIsSupported ? h('button', { onclick: openHomeFolderOnClick}, ['open home folder']) : undefined
      ]);
    }
  };
};
