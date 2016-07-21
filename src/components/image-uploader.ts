//this component shows a canvas 

import {createText} from './text';
import {createModal} from './modal';
import {createTextField} from './text-field';
import {createButton} from './button';
import {createLiveCamera} from './live-camera';

import {h, Component} from 'maquette';


export let createImageUploader = () => {

  let getUserMediaIsSupported = true;
  let modalIsOpen = false;


  let canvas: HTMLCanvasElement,
    context: any,
    video: HTMLVideoElement,
    videoObj: any,
    errBack: any,
    n = <any>navigator,
    mediaTrack: any; 

    errBack = (error: any) => {
      //getUserMediaIsSupported = false;
      console.log(String(error)); 
    };

  let checkUserMediaSupport = () => {
    if (!(n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia)) {
      getUserMediaIsSupported = false;
    }
  }

  checkUserMediaSupport();

  let handleAfterCreateCamera = () => {
    var w = <any>window;

    // Grab elements, create settings, etc.
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    context = canvas.getContext("2d");
    video = <HTMLVideoElement>document.getElementById("video");
    videoObj = { "video": true };

    // Put video listeners into place
    if (n.getUserMedia) { // Standard
      n.getUserMedia(videoObj, function (stream: any) {
        video.src = URL.createObjectURL(stream);
        video.play();
        mediaTrack = stream.getTracks()[0];
      }, errBack);
    } else if (n.webkitGetUserMedia) { // WebKit-prefixed
      n.webkitGetUserMedia(videoObj, function (stream: any) {
        video.src = URL.createObjectURL(stream);
        video.play();
        mediaTrack = stream.getTracks()[0];
      }, errBack);
    }
    else if (n.mozGetUserMedia) { // Firefox-prefixed
      n.mozGetUserMedia(videoObj, function (stream: any) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
        mediaTrack = stream.getTracks()[0];
      }, errBack);
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
    context.drawImage(video, 0, 0, 320, 240);
    console.log('screenshot created!');
  }

  let toggleModal = () => {
    modalIsOpen = !modalIsOpen;
    if (!modalIsOpen) {
      mediaTrack.stop();
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
          createLiveCamera({}, { startCameraAfterCreate: handleAfterCreateCamera })
        ]
      },
        { toggleModal: toggleModal });

      return h('div', [
        getUserMediaIsSupported ? [
          modal.renderMaquette(),
          openModalButton.renderMaquette()
        ]
          : undefined,

        h('input', {
          type: "file",
          capture: 'camera',
          accept: 'image/*',
          id: 'takePictureField',
          onchange: getPicture
        }),

        h('canvas', { id: "canvas", width: '320', height: '240' }),
      ]);
    }
  }
};
