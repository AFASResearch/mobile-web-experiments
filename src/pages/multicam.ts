import {createPage} from '../components/page';
import {createCamera} from '../components/camera';

export let createMultiCamPage = (projector: any) => {
  return createPage({
    title: 'Multicam testing',
    className: 'card',
    body: [
      createCamera({ projector: projector}, {})
    ]
  });
};
