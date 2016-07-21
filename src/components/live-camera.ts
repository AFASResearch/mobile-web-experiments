/* 
    this component returns a videoview, 
    and optionally an additional canvas and textview in which the code of a barcode is shown. 
*/

import {h, Component, Projector} from 'maquette';
require('../styles/live-camera.scss');

const Quagga = <any>require('quagga'); //library for scanning barcodes

export interface LiveCameraConfig { 
    projector: Projector, 
    BarcodeScanEnabled: Boolean
}

export interface LiveCameraBindings { }

export let createLiveCamera = (config: LiveCameraConfig, bindings: LiveCameraBindings) => {
    let {projector, BarcodeScanEnabled} = config;

    let detectedCode = 'nothing detected yet...';

    let startCamera = () => {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: '#barcodeScanViewHolder'
            },
            decoder: {
                readers: ["ean_reader"]
            }
        }, function (err: any) {
            if (err) {
                console.log(err);
                return
            }

            // only start quagga if we want it
            if (BarcodeScanEnabled) { 
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            }
        });

        Quagga.onProcessed(function (result: any) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box: any) {
                        return box !== result.box;
                    }).forEach(function (box: any) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        })

        Quagga.onDetected(function (result: any) {
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

    return {
        renderMaquette: () => {
            return h('div', { class: "camera-container" }, [

                BarcodeScanEnabled ? [ 
            h('h2', [detectedCode]),
            h('input', { type: "file", capture: 'camera', accept: 'image/*', id: 'takePictureField'}),
            ] : undefined,

            // after the DOM is loaded we will try to load the video in it
            h('div', { id: 'barcodeScanViewHolder', class: 'viewport', afterCreate: startCamera }),

          ]);
        }
    }
}

