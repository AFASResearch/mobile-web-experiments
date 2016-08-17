import {createPage} from '../components/page';
import {createLiveCamera, destroyLiveCamera} from '../components/live-camera';

export let createBarcodePage = (projector: any) => {
  return createPage({
    title: 'Barcodescanning',
    body: [
      createLiveCamera({ projector: projector, BarcodeScanEnabled: true }, {})
    ], destroy: () => {
      destroyLiveCamera();
    }
  });
};
