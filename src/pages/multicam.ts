import {createPage} from '../components/page';
import {createCamera} from '../components/camera';

export let createMultiCamPage = (projector: any) => {
  return createPage({
    title: 'Multicam testing',
    body: [
      createCamera({ projector: projector}, {})
    ]
  });
};
