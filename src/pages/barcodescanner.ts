import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createModal} from '../components/modal';
import {createTextField} from '../components/text-field';
import {createButton} from '../components/button';
import {createLiveCamera} from '../components/live-camera';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';

const Quagga = <any>require('quagga'); 

import {Projector, h, Component} from 'maquette';

export let createBarcodePage = (dataService: DataService, userService: UserService, projector: any) => {


let detectedCode = 'nothing detected yet...';

let startDecoding = () => { 

 Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: '#barcodeScanViewHolder'
    },
    decoder : {
      readers : ["ean_reader"]
    }
  }, function(err: any) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });

  Quagga.onProcessed(function(result: any) { 
//    console.log(result);
    var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box: any) {
                    return box !== result.box;
                }).forEach(function (box: any) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
  })

  Quagga.onDetected(function(result: any) {
        var code = result.codeResult.code;
        console.log("ondetected found something:");
        console.log(code);
        console.log("more technical details:");
        console.log(result);
        detectedCode = code;
        projector.scheduleRender();
    });
}

 

let decodeImage = (imageURL: String) => {

//   console.log("decoding..."); 
//   Quagga.decodeSingle({
//     decoder: {
//         readers: ["ean_reader"] // List of active readers
//     },
//     locate: true, // try to locate the barcode in the image
//     src: imageURL // or 'data:image/jpg;base64,' + data
//     }, function(result: any){
//      console.log(imageURL);
//       console.log(result);
//     if(result.codeResult) {
//         console.log("result", result.codeResult.code);
//     } else {
//         console.log("not detected");
//     }
// });
}


  let getPicture = (event: any) => {
    if (event.target.files.length == 1 &&
      event.target.files[0].type.indexOf("image/") == 0) {

      var image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = function () {
    //    context.drawImage(image, 0, 0, 320, 240);
    decodeImage(URL.createObjectURL(event.target.files[0]));
      }
    }
  }


  let page = createPage({
    title: 'Barcodescanning',
    dataService,
    body: [
      {
        renderMaquette: () => {
          return h('div', { class: "camera-container" }, [ 
            h('h2', [detectedCode]),
            h('input', { type: "file", capture: 'camera', accept: 'image/*', id: 'takePictureField', onchange: getPicture }),

            // after the DOM is loaded we will try to load the video in it
            h('div', { id: 'barcodeScanViewHolder', class: 'viewport', afterCreate: startDecoding}),
           
          ]);
        }
      },

    ]
  });
  return page;
};

