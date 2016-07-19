import {createPage} from '../components/page/page';
import {createText} from '../components/text/text';
import {createModal} from '../components/modal/modal';
import {createTextField} from '../components/text-field/text-field';
import {createButton} from '../components/button/button';
import {createLiveCamera} from '../components/live-camera/live-camera';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {h} from 'maquette';

export let createCameraPage = (dataService: DataService, userService: UserService) => {

  let canvas: HTMLCanvasElement,
    context: any,
    video: HTMLVideoElement,
    videoObj: any,
    errBack: any;

  let initCamera = () => {
    var w = <any>window;

    // Grab elements, create settings, etc.
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    context = canvas.getContext("2d");
    video = <HTMLVideoElement>document.getElementById("video");
    videoObj = { "video": true };
    errBack = function (error: any) {
      alert("Video capture error: " + error.code);
    };

    var n = <any>navigator;

    // Put video listeners into place
    if (n.getUserMedia) { // Standard
      n.getUserMedia(videoObj, function (stream: any) {
        video.src = stream;
        video.play();
      }, errBack);
    } else if (n.webkitGetUserMedia) { // WebKit-prefixed
      n.webkitGetUserMedia(videoObj, function (stream: any) {
        video.src = w.webkitURL.createObjectURL(stream);
        video.play();
      }, errBack);
    }
    else if (n.mozGetUserMedia) { // Firefox-prefixed
      n.mozGetUserMedia(videoObj, function (stream: any) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, errBack);
    } else {
      // we might be able to do some useful stuff here 
      console.log("getUserMedia not supported");
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

  function createScreenShot() {
    context.drawImage(video, 0, 0, 320, 240);
  }

  let snapShotButton = createButton({
    text: 'Create Snapshot',
    primary: true
  }, { onClick: createScreenShot });

  let page = createPage({
    title: 'Camera',
    dataService,
    body: [
      createText({ htmlContent: 'May I take your picture?' }),
      createModal(createLiveCamera(snapShotButton)),
      {
        renderMaquette: () => {
          return h('div', { class: "camera-container" }, [
            //h('button', {id: "snap", onclick: createScreenShot}, ['snap photo']),
            h('input', { type: "file", capture: 'camera', accept: 'image/*', id: 'takePictureField', onchange: getPicture }),

            // after the DOM is loaded we will try to load the video in it
            h('canvas', { id: "canvas", width: '320', height: '240', afterCreate: initCamera }),

          ]);
        }
      }
    ]
  });
  return page;
};

