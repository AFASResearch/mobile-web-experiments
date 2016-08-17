import {Projector, h} from 'maquette';
import {createPage} from '../components/page';
import {createTextField} from '../components/text-field';
import {createText} from '../components/text';
import {createButton} from '../components/button';
import {createDragDropFileUpload} from '../components/drag-drop-file-upload';
import {createFileDownload} from '../components/file-download';

declare let cordova: any;
declare let window: any;
declare let FileTransfer: any;

export let createFileUploadPage = (projector: Projector) => {

  let newFileTitle: string = '';
  let newFileContent: string = '';
  let allEntries: any[];
  let fileSystem: any;

  // do alerts as error callback
  let onErrorLoadFs = () => { alert('onErrorLoadFs'); };
  let onErrorCreateFile = () => { alert('onerrorcreatefile'); };
  let onErrorReadFile = () => { alert('onErrorReadFile'); };

  // get the folders in the filesystem
  let getEntries = (filesystem: any) => {
    let reader = filesystem.root.createReader();
    reader.readEntries((entries: any) => {
      allEntries = entries;

      projector.scheduleRender();
    }, onErrorReadFile);
  };

  let deleteFile = (evt: Event) => {

    let target = evt.currentTarget as HTMLElement;
    let fileName = target.getAttribute('data-fileName');

    fileSystem.root.getFile(fileName, { create: true, exclusive: false }, (fileEntry: any) => {

      fileEntry.remove(() => {
        console.log('File removed!');
        getEntries(fileSystem);
      }, () => {
        console.log('error deleting the file ');
      });
    });
  };

  // read the content from a file
  let readFile = (fileEntry: any) => {
    fileEntry.file(function (file: any) {
      let reader = new FileReader();
      reader.onloadend = function () {
        console.log('Successful file read: ' + this.result);
      };
      reader.readAsText(file);
    }, onErrorReadFile);
  };

  // write content to a file
  let writeFile = (fileEntry: any, dataObj: any) => {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter((fileWriter: any) => {
      fileWriter.onwriteend = () => {
        readFile(fileEntry);
      };

      fileWriter.onerror = (e: Error) => {
        console.log('Failed file read: ' + e.toString());
      };

      // If data object is not passed in, create a new Blob instead.
      if (!dataObj) {
        dataObj = new Blob([newFileContent], { type: 'text/plain' });
      }
      fileWriter.write(dataObj);
    });
    getEntries(fileSystem);
  };

  // in this function cordova's global functions can be used.
  let onDeviceReady = () => {
    allEntries = [];
    console.log(FileTransfer);
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs: any) {
      fileSystem = fs;
      getEntries(fileSystem);
    }, onErrorLoadFs);
  };
  document.addEventListener('deviceready', onDeviceReady, false);

  // Create new txt file (on button click)
  let createNewFile = () => {
    fileSystem.root.getFile(newFileTitle, { create: true, exclusive: false }, (fileEntry: any) => {
      writeFile(fileEntry, null);
    }, onErrorCreateFile);
  };

  let openFile = (evt: Event) => {
    let target = evt.currentTarget as HTMLElement;
    let fileName = target.getAttribute('data-fileName');

    fileSystem.root.getFile(fileName, { create: true, exclusive: false }, (fileEntry: any) => {

      fileEntry.file(function (file: any) {
        let reader = new FileReader();
        reader.onloadend = function () {
          alert('Successful file read: ' + this.result);
        };
        reader.readAsText(file);
      }, onErrorReadFile);
    });
  };

  let editFile = (evt: Event) => {
    let target = evt.currentTarget as HTMLElement;
    let fileName = target.getAttribute('data-fileName');

    newFileTitle = fileName;

    fileSystem.root.getFile(fileName, { create: true, exclusive: false }, (fileEntry: any) => {
      fileEntry.file(function (file: any) {
        let reader = new FileReader();
        reader.onloadend = function () {
          newFileContent = this.result;
          projector.scheduleRender();
        };
        reader.readAsText(file);
      }, onErrorReadFile);
    });
  };

  // !! Assumes letiable fileURL contains a valid URL to a path on the device,
  //    for example, cdvfile://localhost/persistent/path/to/downloads/
  // let fileTransfer = new FileTransfer();
  // let uri = encodeURI('http://some.server.com/download.php');
  // fileTransfer.download(
  //     uri,
  //     fileURL,
  //     function(entry) {
  //         console.log('download complete: ' + entry.toURL());
  //     },
  //     function(error) {
  //         console.log('download error source ' + error.source);
  //         console.log('download error target ' + error.target);
  //         console.log('upload error code' + error.code);
  //     },
  //     false,
  //     {
  //         headers: {
  //             'Authorization': 'Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=='
  //         }
  //     }
  // );

  return createPage({
    title: 'File upload / file reading',
    body: [
      createText({ htmlContent: '<h2>All browsers/devices</h2>' }),
      createDragDropFileUpload(),
      createFileDownload(),
      createText({ htmlContent: '<h2>[Cordova] add new file </h2>' }),
      createTextField({ label: 'title' }, { getValue: () => newFileTitle, setValue: (value) => { newFileTitle = value; } }),
      createTextField({ label: 'content' }, { getValue: () => newFileContent, setValue: (value) => { newFileContent = value; } }),
      createButton({ text: 'Create the file', primary: true }, { onClick: createNewFile }),
      {
        renderMaquette: () => {
          return h('div', [
            allEntries ? h('div', [allEntries.map((entry) => [
              h('div', { class: 'attachment', key: entry.name }, [
                h('p', { key: entry.name }, [entry.name]),
                h('button', { class: 'button invertedPrimary', onclick: editFile, key: entry.name, 'data-fileName': entry.name }, ['edit']),
                h('button', { class: 'button invertedPrimary', onclick: openFile, key: entry.name, 'data-fileName': entry.name }, ['show/download']),
                h('button', { class: 'button invertedDanger', onclick: deleteFile, key: entry.name, 'data-fileName': entry.name }, ['delete'])
              ])
            ])
          ])
          : h('div', ['loading files...'])
        ]);
      }
    }
  ]
});
};
