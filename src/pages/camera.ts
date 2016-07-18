import {createPage} from '../components/page/page';
import {createText} from '../components/text/text';
import {createTextField} from '../components/text-field/text-field';
import {createButton} from '../components/button/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {h} from 'maquette';

export let createCameraPage = (dataService: DataService, userService: UserService) => {

      function gotPic(event : any) {
        if(event.target.files.length == 1 && 
           event.target.files[0].type.indexOf("image/") == 0) {
           var mobileScreenshot = <HTMLImageElement> document.getElementById("mobile-screenshot")
           mobileScreenshot.src = URL.createObjectURL(event.target.files[0]);
        }
	    }

    function createScreenShot() { 
        console.log("creating screenshot...");
        var w = <any>window;

        // Grab elements, create settings, etc.
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var video = <HTMLVideoElement> document.getElementById("video");
        var videoObj = { "video": true };
        var errBack = function(error : any) {
          alert("Video capture error: " + error.code); 

        };

        var n = <any>navigator;

        // Put video listeners into place
        if(n.getUserMedia) { // Standard
          n.getUserMedia(videoObj, function(stream : any) {
            video.src = stream;
            video.play();
          }, errBack);
        } else if(n.webkitGetUserMedia) { // WebKit-prefixed
          n.webkitGetUserMedia(videoObj, function(stream : any){
            video.src = w.webkitURL.createObjectURL(stream);
            video.play();
          }, errBack);
        }
        else if(n.mozGetUserMedia) { // Firefox-prefixed
          n.mozGetUserMedia(videoObj, function(stream : any){
            video.src = window.URL.createObjectURL(stream);
            video.play();
          }, errBack);
        } else {
           alert("getUserMedia not supported");
        } 
	      context.drawImage(video, 0, 0, 320, 240);
       }

  let page = createPage({
    title: 'Camera',
    dataService,
    body: [
      createText({ htmlContent: 'May I take your picture?' }),
       {
        renderMaquette: () => {
            return  h('div', {class: "camera-container"},[
                h('b', ['desktop version:']),
                h('hr'),
                h('video', {id: "video", width: '320', height: '240'}),
                h('button', {id: "snap", onclick: createScreenShot}, ['snap photo']),
                h('canvas', {id: "canvas", width: '320', height: '240'}),
                h('br'),
                h('b', ['mobile version:']),
                h('hr'),
                h('input', {type: "file", capture: 'camera', accept: 'image/*', id: 'takePictureField', onchange: gotPic}),
                h('img', {id: 'mobile-screenshot', height: '100px', width: '100px'})
            ]);
        }
    }
    ]
  });

  return page;
};

