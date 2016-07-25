import {createModal} from './modal';
import {createButton} from './button';
import {createLiveCamera} from './live-camera';
import {UserService} from '../services/user-service';
import {h, Projector} from 'maquette';
require('../styles/image-uploader.scss');
const Quagga = <any>require('quagga'); // library for scanning barcodes

export interface ImageUploaderConfig {
  projector: Projector;
  userService: UserService;
  image: string;
}

export interface ImageUploaderBindings { }

export let createImageUploader = (config: ImageUploaderConfig, bindings: ImageUploaderBindings) => {

  let {projector, image} = config;

  let getUserMediaIsSupported = true;
  let modalIsOpen = false;
  let elementsCreated = false;
  let canvasCreated = false;

  let canvas: HTMLCanvasElement,
    context: any,
    video: HTMLVideoElement,
    videoObj: any,
    errBack: any,
    n = <any>navigator;

  errBack = (error: any) => {
    console.log(String(error));
  };

  let checkUserMediaSupport = () => {
    if (!(n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia)) {
      getUserMediaIsSupported = false;
    }
  };

  checkUserMediaSupport();

  let createCanvas = () => {
    if (!canvasCreated) {
      canvas = <HTMLCanvasElement>document.getElementById('canvas');
      context = canvas.getContext('2d');
      canvasCreated = true;
    }
  };

  let createElements = () => {
    // this must happen only once
    if (!elementsCreated) {
      // Grab elements, create settings, etc.
      createCanvas();
      // get video from the holder
      let parent = <any>document.getElementById('barcodeScanViewHolder');
      video = <HTMLVideoElement>parent.getElementsByTagName('video')[0];
      videoObj = { 'video' : true };

      elementsCreated = true;
    }
  };

  let getPicture = (event: any) => {
    createCanvas();
    if (event.target.files.length === 1 &&
      event.target.files[0].type.indexOf('image/') === 0) {

      let temp_image = new Image();
      temp_image.src = URL.createObjectURL(event.target.files[0]);
      temp_image.onload = function () {
        context.drawImage(temp_image, 0, 0, 320, 240);
      };
    }
  };

  let toggleModal = () => {
    modalIsOpen = !modalIsOpen;
    if (!modalIsOpen) {
      Quagga.stop();
    }
  };

  let createScreenShot = () => {
    createElements();
    context.drawImage(video, 0, 0, 320, 240);
    toggleModal();
  };

  let openModalButton = createButton(
    {
      text: 'Use webcam',
      primary: false
    },
    {
      onClick: toggleModal
    });

  let setInitialImageAfterCreate = () => {
      createCanvas();

      let img = new Image;
      img.src = image;
      context.drawImage(img, 0, 0, 320, 240);
  };

  let createScreenshotButton = createButton({ text: 'Create Snapshot', primary: false }, { onClick: createScreenShot });

  return {
    renderMaquette: () => {
      let modal = createModal(
      {
        isOpen: modalIsOpen,
        title: 'Create a snapshot',
        contents: [
          createScreenshotButton,
          createLiveCamera({ projector: projector, BarcodeScanEnabled: false }, {}) // we don't want to use barcodes when uploading images.
        ]
      },
      {
        toggleModal: toggleModal
      });

      return h('div', { class: 'live-camera-holder' }, [
        h('div', { class: 'image-uploader-buttons' }, [
          getUserMediaIsSupported ? [
            modal.renderMaquette(),
            openModalButton.renderMaquette()
          ] : undefined,

          h('input', {
            class: 'button',
            type: 'file',
            capture: 'camera',
            accept: 'image/*',
            id: 'takePictureField',
            onchange: getPicture
          })
        ]),
        h('canvas', { id: 'canvas', width: '320', height: '240', afterCreate: setInitialImageAfterCreate })
      ]);
    }
  };
};
