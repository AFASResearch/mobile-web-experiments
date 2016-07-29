import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
declare let cordova: any;
declare let window: any;

export let createFileUploadPage = (dataService: DataService, projector: Projector) => {

  let onErrorLoadFs = () => {
    alert('onErrorLoadFs');
  };

  let onErrorCreateFile = () => {
    alert('onerrorcreatefile');
  };

  let onErrorReadFile = () => {
    alert('onErrorReadFile');
  };

  document.addEventListener('deviceready', onDeviceReady, false);

  // in this function cordova's global functions can be used.
  function onDeviceReady() {
    console.log('loading file access');
    console.log(cordova.file);
    console.log('File access loaded');

    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs: any) {

      console.log('file system open: ' + fs.name);
      createFile(fs.root, 'newTempFile.txt', false);

    }, onErrorLoadFs);
  }

  let readFile = (fileEntry: any) => {
    fileEntry.file(function (file: any) {
      let reader = new FileReader();
      reader.onloadend = function () {
        console.log('Successful file read: ' + this.result);
        // displayFileData(fileEntry.fullPath + ": " + this.result);
      };
      reader.readAsText(file);
    }, onErrorReadFile);
  };

  let writeFile = (fileEntry: any, dataObj: any, isAppend: any) => {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter: any) {
      fileWriter.onwriteend = function () {
        console.log('Successful file read...');
        readFile(fileEntry);
      };

      fileWriter.onerror = function (e: Error) {
        console.log('Failed file read: ' + e.toString());
      };

      // If we are appending data to file, go to the end of the file.
      if (isAppend) {
        try {
          fileWriter.seek(fileWriter.length);
        } catch (e) {
          console.log("file doesn't exist!");
        }
      }

      // If data object is not passed in, create a new Blob instead.
      if (!dataObj) {
        dataObj = new Blob(['some file data'], { type: 'text/plain' });
      }
      fileWriter.write(dataObj);
    });
  };

  function createFile(dirEntry: any, fileName: string, isAppend: boolean) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry: any) {
      writeFile(fileEntry, null, isAppend);
    }, onErrorCreateFile);

  }

  return createPage({
    title: 'File upload',
    dataService,
    body: [
      {
        renderMaquette: () => {
          return h('div', { id: 'dropzone' }, [
            h('input', { type: 'file', name: 'file[]', multiple: true }, []),
            h('form', { id: 'my-awesome-dropzone', action: 'file/upload', class: 'dropzone' }),
            h('a', { download: 'pdf.pdf', href: 'images/pdf.pdf', title: 'imageName' }, ['download a fancy image'])
          ]);
        }
      }
    ]
  });
};
