import {createText} from './text';
import {createModal} from './modal';
import {createTextField} from './text-field';
import {createButton} from './button';
import {createLiveCamera} from './live-camera';
import {h, Component, Projector} from 'maquette';
require('../styles/image-uploader.scss');
const Quagga = <any>require('quagga'); //library for scanning barcodes

export let createImageUploader = (projector: Projector) => {

  let getUserMediaIsSupported = true;
  let modalIsOpen = false;
  let elementsCreated = false;

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
  }

  checkUserMediaSupport();
    var w = <any>window;

let createElements = () => {
  //this must happen only once
  if (!elementsCreated) {
    // Grab elements, create settings, etc.
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    context = canvas.getContext("2d");

    // get video from the holder
    let parent = <any>document.getElementById('barcodeScanViewHolder');
    video = <HTMLVideoElement>parent.getElementsByTagName("video")[0];
    videoObj = { "video": true };
  
    elementsCreated = false;
}
}

  let getPicture = (event: any) => {
    if (event.target.files.length == 1 &&
      event.target.files[0].type.indexOf("image/") == 0) {

      var image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = function () {
        context.drawImage(image, 0, 0, 320, 240);
      }
    }
  }


  let createScreenShot = () => {
    createElements(); 
    context.drawImage(video, 0, 0, 320, 240);
    toggleModal();
  }

  let toggleModal = () => {
    modalIsOpen = !modalIsOpen;
    if (!modalIsOpen) {
     Quagga.stop()
    }
  }

  let openModalButton = createButton({
    text: 'Open modal',
    primary: false
  }, { onClick: toggleModal });

  let createScreenshotButton = createButton({ text: 'Create Snapshot', primary: false }, { onClick: createScreenShot });

  return {
    renderMaquette: () => {

      let modal = createModal({
        isOpen: modalIsOpen,
        title: "Create a snapshot",
        contents: [
          createScreenshotButton,
          createLiveCamera({ projector: projector, BarcodeScanEnabled: true }, {})
        ]
      },
        { toggleModal: toggleModal });

      return h('div', {class: 'live-camera-holder'}, [
        h('div', {class: 'image-uploader-buttons'}, [
        getUserMediaIsSupported ? [
          modal.renderMaquette(),
          openModalButton.renderMaquette()
        ] : undefined,

        h('input', {
          class: "button",
          type: "file",
          capture: 'camera',
          accept: 'image/*',
          id: 'takePictureField',
          onchange: getPicture
        })
      ]),
        h('canvas', { id: "canvas", width: '320', height: '240'}),
      ]);
    }
  }
};
