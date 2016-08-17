import {Projector} from 'maquette';
import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createDragDropFileUpload} from '../components/drag-drop-file-upload';
import {createFileDownload} from '../components/file-download';
import { createCordovaFileBrowser} from '../components/cordova-file-browser';

export let createFileUploadPage = (projector: Projector) => {
  return createPage({
    title: 'File upload / file reading',
    body: [
      createText({ htmlContent: '<h2>All browsers/devices</h2>' }),
      createDragDropFileUpload(),
      createFileDownload(),
      createCordovaFileBrowser(projector)
    ]
  });
};
