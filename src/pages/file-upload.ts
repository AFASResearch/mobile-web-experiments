import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';

export let createFileUploadPage = (dataService: DataService, projector: Projector) => {
  return createPage({
    title: 'File upload',
    dataService,
    body: [
      {
        renderMaquette: () => {
          return h('div', {id: 'dropzone'}, [
            h('input', {type: 'file', name: 'file[]', multiple: true}, []),
            h('form', {id: 'my-awesome-dropzone', action: 'file/upload', class: 'dropzone'}),
            h('a', {download: 'pdf.pdf', href: 'images/pdf.pdf', title: 'imageName'}, [ 'download a fancy image' ])
         ]);
        }
      }
    ]
  });
};
