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
      { renderMaquette: () => { 
          return h('div', {id: 'dropzone'}, [
          h('input', {type: 'file', name: 'file[]', multiple: true}, []),
          h('form', {id:"my-awesome-dropzone", action: 'file/upload', class: "dropzone"}),
          h('a', {download: 'pdf.pdf', href: "images/pdf.pdf", title: "imageName"}, [ 'download a fancy image' ]) 
        ])
      }
      }
    ]
  });

};
