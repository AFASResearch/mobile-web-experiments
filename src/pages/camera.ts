import {createPage} from '../components/page/page';
import {createText} from '../components/text/text';
import {createTextField} from '../components/text-field/text-field';
import {createButton} from '../components/button/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {h} from 'maquette';

export let createCameraPage = (dataService: DataService, userService: UserService) => {

    function createScreenShot() { 
        console.log("creating screenshot...");
        var w = <any>window;

        // Grab elements, create settings, etc.
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var video = <HTMLVideoElement> document.getElementById("video");
        var videoObj = { "video": true };
        var errBack = function(error : any) {
          console.log("Video capture error: ", error.code); 
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
        }
	      context.drawImage(video, 0, 0, 640, 480);
       }


  let page = createPage({
    title: 'Camera',
    dataService,
    body: [
      createText({ htmlContent: 'May I take your picture?' }),
       {
        renderMaquette: () => {
            return  h('div', {class: "test"},[
                h('video', {id: "video", width: '640', height: '480'}),
                h('button', {id: "snap", onclick: createScreenShot}, ['snap photo']),
                h('canvas', {id: "canvas", width: '640', height: '480'})
            ]);
        }
    }
    ]
  });

  return page;
};

