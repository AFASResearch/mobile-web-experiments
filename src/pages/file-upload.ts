import {Projector} from 'maquette';
import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createDragDropFileUpload} from '../components/drag-drop-file-upload';
import {createFileDownload} from '../components/file-download';
import { createCordovaFileBrowser} from '../components/cordova-file-browser';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';
declare let cordova: any;

export let createFileUploadPage = (dataService: DataService, userService: UserService, projector: Projector) => {

  return createPage({
    className: 'card',
    dataService,
    userService,
    projector,
    body: [
      createText({ htmlContent: '<h2>All browsers/devices</h2>' }),
      createDragDropFileUpload(),
      createFileDownload(),
      createCordovaFileBrowser(projector)
    ]
  }, { title: () => 'File upload/download' });
};
