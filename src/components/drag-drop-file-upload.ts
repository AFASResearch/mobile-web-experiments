/*
* This component creates an input, which uses the HTML5 standard.
* due to the custom styling it is easy to drag and drop.
* Normally drag and drop is supported if you drag the file on to the button. (but that is not very clear to users)
*/

import {h, Projector} from 'maquette';
require('../styles/drag-drop-file-upload.scss');
declare let window: any; 
let electronIsSupported: boolean = false;

let filenames: string[] = [];

export let createDragDropFileUpload = (projector: Projector) => {


let electron: any; 
let shell: any; 
let os: any;
let fs: any; 


let initElectron = () => { 
  electron = window.require('electron'); 
  shell = electron.shell; 
  os = window.require('os'); 
  fs = window.require('fs');  // https://nodejs.org/api/fs.html
}

if (typeof window.require !== 'undefined') {
  electronIsSupported = true; 
  initElectron();
}

let openHomeFolderOnClick = () => { 
 fs.readdir(os.homedir(), (err: Error, results: string[]) => {
  if (err) throw err;  

  filenames = results; 
    projector.scheduleRender(); 
  });

  console.log(electron);
  console.log(electron.remote);
}

// also for electron
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
}

document.body.ondrop = (ev) => {
  shell.openItem((ev.dataTransfer.files[0] as any).path);
  ev.preventDefault();
}

  return {
    renderMaquette: () => {
      return h('div', [
        // browsers allow already by themselves to drag files on a input='file' element.
        h('input', { id: 'file-upload', type: 'file', name: 'file[]', multiple: true}),
        h('span', ['drag a file in this window to open it']),
        electronIsSupported ? h('button', { onclick: openHomeFolderOnClick}, ['show contents of your home folder']) : undefined,
        h('ul', [ 
          filenames.map((filename: string) => { 
            return h('li', {key: filename}, [filename]);
          })
        ])
      ]);
    }
  };
};
