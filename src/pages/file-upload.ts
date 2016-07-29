import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
import {createTextField} from '../components/text-field';

import {createButton} from '../components/button';

declare let cordova: any;
declare let window: any;

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
      entries.forEach((entry: any) => {
        console.log(entry);
      });
      projector.scheduleRender();
    }, onErrorReadFile);
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
  };

  // in this function cordova's global functions can be used.
  let onDeviceReady = () => {
    allEntries = [];
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
    getEntries(fileSystem);
  };

  return createPage({
    title: 'File upload / file reading',
    dataService,
    body: [
      createTextField({ label: 'title' }, { getValue: () => newFileTitle, setValue: (value) => { newFileTitle = value; } }),
      createTextField({ label: 'content' }, { getValue: () => newFileContent, setValue: (value) => { newFileContent = value; } }),
      createButton({ text: 'Create the file', primary: true }, { onClick: createNewFile }),
      {
        renderMaquette: () => {
          return h('div', [
            //  h('input', { type: 'file', name: 'file[]', multiple: true }, []),
            // h('a', { download: 'pdf.pdf', href: 'images/pdf.pdf', title: 'imageName' }, ['download a fancy image']),
            allEntries ? h('div', [allEntries.map(entry => h('p', { class: 'attachment', key: entry.name }, [entry.name]))]) : h('div', ['loading files...'])
          ]);
        }
      }
    ]
  });
};
