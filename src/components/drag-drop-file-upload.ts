import {h} from 'maquette';
require('../styles/drag-drop-file-upload.scss');

export interface DragDropFileUploadConfig {
}

export interface DragDropFileUploadBindings {
}

export let createDragDropFileUpload = (config: DragDropFileUploadConfig, bindings: DragDropFileUploadBindings) => {
  let initDragDropFunctionsAfterCreate = () => {

    // http://www.html5rocks.com/en/tutorials/file/dndfiles/
     let dropZone = document.getElementById('dropZone');

     // Optional. Show the copy icon when dragging over. Seems to only work for Chrome.
     dropZone.addEventListener('dragover', function(e) {
       e.stopPropagation();
       e.preventDefault();
       e.dataTransfer.dropEffect = 'copy';
     });

  //   // Get file data on drop
  //   dropZone.addEventListener('drop', function(e: any) {
  //     e.stopPropagation();
  //     e.preventDefault();
  //
  //     let files = e.dataTransfer.files; // Array of all files
  //     for (let i = 0; i < files.length; i++) {
  //       let file = files[i];
  //       if (file.type.match(/image.*/)) {
  //         let reader = new FileReader();
  //         reader.onload = function(e2: any) { // finished reading file data.
  //           let img = document.createElement('img');
  //           img.src = e2.target.result;
  //           img.width = 250;
  //           img.height = 150;
  //
  //           dropZone.appendChild(img);
  //           fileInputButton.value = file;
  //         };
  //         reader.readAsDataURL(file); // start reading the file data.
  //       }
  //     }
  //   });
  // };
};

  return {
    renderMaquette: () => {
      return h('div', [
        h('input', { id: 'file-upload', type: 'file', name: 'file[]', multiple: true})
      ]);
    }
  };
};
