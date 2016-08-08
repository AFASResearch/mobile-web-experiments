import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
import {createTextField} from '../components/text-field';
import {createText} from '../components/text';
import {createButton} from '../components/button';
require('../styles/file-upload.scss');
let $ = <any>require('jquery');

declare let cordova: any;
declare let window: any;
declare let FileTransfer: any;

export let createFileUploadPage = (dataService: DataService, projector: Projector) => {

  let newFileTitle = '';
  let newFileContent = '';
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

  let dragDropFunctions = () => {

    let dropZoneId = 'drop-zone';
    let buttonId = 'clickHere';
    let mouseOverClass = 'mouse-over';
    let dropZone = $('#' + dropZoneId);

    let ooleft = dropZone.offset().left;
    let ooright = dropZone.outerWidth() + ooleft;

    let ootop = dropZone.offset().top;
    let oobottom = dropZone.outerHeight() + ootop;

    let inputFile = dropZone.find('input');

    document.getElementById(dropZoneId).addEventListener('dragover', function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.addClass(mouseOverClass);
        let x = e.pageX;
        let y = e.pageY;

        console.log(x, y);

        if (!(x < ooleft || x > ooright || y < ootop || y > oobottom)) {
            inputFile.offset({ top: y - 15, left: x - 100 });
        } else {
            inputFile.offset({ top: -400, left: -400 });
        }

    }, true);

    if (buttonId !== '') {
        let clickZone = $('#' + buttonId);

        let oleft = clickZone.offset().left;
        let oright = clickZone.outerWidth() + oleft;
        let otop = clickZone.offset().top;
        let obottom = clickZone.outerHeight() + otop;

        clickZone.mousemove(function (e: any) {
            let x = e.pageX;
            let y = e.pageY;
            if (!(x < oleft || x > oright || y < otop || y > obottom)) {
                inputFile.offset({ top: y - 15, left: x - 160 });
            } else {
                inputFile.offset({ top: -400, left: -400 });
            }
        });
    }

    document.getElementById(dropZoneId).addEventListener('drop', function (e) {
        dropZone.removeClass(mouseOverClass);
    }, true);
  };

  return createPage({
    title: 'File upload / file reading',
    dataService,
    body: [
      createText({ htmlContent: '<h2>All browsers/devices</h2>' }),
      {
        renderMaquette: () => {
          return h('div', [
            h('input', { type: 'file', name: 'file[]', multiple: true}, []),
            h('a', { download: 'pdf.pdf', href: 'images/pdf.pdf', title: 'imageName' }, ['download a fancy image']),
            h('div', {id: 'drop-zone', afterCreate: dragDropFunctions}, [
              'drop files here',
              h('div', {id: 'clickHere'}, [
                'or click here',
                h('input', {type: 'file', name: 'file', id: 'file'})
              ])
              ]),
            h('hr')
          ]);
        }
      },
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
