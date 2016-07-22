import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserInfo} from '../interfaces';
import {createPage} from '../components/page';
import {createList} from '../components/list';
import {createText} from '../components/text';

export let createFileUploadPage = (dataService: DataService, projector: Projector) => {

  return createPage({
    title: 'File upload',
    dataService,
    body: [
      createText({ htmlContent: "upload files..." }),
      createText({ htmlContent: "some ideas would be: drag and drop, google drive file uploader, dropbox... etc." }),
      { renderMaquette: () => { 
          return h('input', {type: 'file', name: 'file[]', multiple: true}, []) 
        } 
      }
    ]
  });

};
