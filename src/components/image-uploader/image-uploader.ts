//this component shows a canvas 

import {createText} from '../text/text';
import {createModal} from '../modal/modal';
import {createTextField} from '../text-field/text-field';
import {createButton} from '../button/button';
import {createLiveCamera} from '../live-camera/live-camera';

import {h, Component} from 'maquette';
let styles = <any>require('./image-uploader.css');


export let createImageUploader = () => {

  let getUserMediaIsSupported = true;
  let modalIsOpen = false; 

  let canvas: HTMLCanvasElement,
    context: any,
    video: HTMLVideoElement,
    videoObj: any,
    errBack: any;

  let handleAfterCreateCamera = () => {
    var w = <any>window;

    // Grab elements, create settings, etc.
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    context = canvas.getContext("2d");
    video = <HTMLVideoElement>document.getElementById("video");
    videoObj = { "video": true };
    errBack = (error: any) => {
      alert("Video capture error: " + error.code);
    };

    var n = <any>navigator;
    
    // Put video listeners into place
    if (n.getUserMedia) { // Standard
      n.getUserMedia(videoObj, function (stream: any) {
        video.src = URL.createObjectURL(stream);
        video.play();
      }, errBack);
    } else if (n.webkitGetUserMedia) { // WebKit-prefixed
      n.webkitGetUserMedia(videoObj, function (stream: any) {
        video.src = URL.createObjectURL(stream);
        video.play();
      }, errBack);
    }
    else if (n.mozGetUserMedia) { // Firefox-prefixed
      n.mozGetUserMedia(videoObj, function (stream: any) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, errBack);
    } else {
      getUserMediaIsSupported = false;
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
           createLiveCamera({},{ startCameraAfterCreate: handleAfterCreateCamera })
          ]}, 
        {toggleModal: toggleModal}); 

      return h('div', [
        openModalButton.renderMaquette(),
        getUserMediaIsSupported ? modal.renderMaquette() : undefined, 

        h('input', { type: "file", 
                     capture: 'camera', 
                     accept: 'image/*', 
                     id: 'takePictureField', 
                     onchange: getPicture 
                   }),

        h('canvas', { id: "canvas", width: '320', height: '240'}),
      ]);
    }
  }
};
