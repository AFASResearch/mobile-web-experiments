import {createModal} from './modal';
import {createButton} from './button';
import {createCamera, destroyCamera} from './camera';
import {UserService} from '../services/user-service';
import {h, Projector} from 'maquette';
import {ImageUploaderConfig, ImageUploaderBindings} from './image-uploader';
require('../styles/image-uploader.scss');

let drawImageProp = (ctx: any, img: any, x?: number, y?: number, w?: number, h?: number, offsetX?: number, offsetY?: number) => {

  if (x === undefined) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx: number, cy: number, cw: number, ch: number, ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

export let createSimpleImageUploader = (config: {projector: Projector}, bindings: {getImage: () => string; setImage: (imageData: string) => void}) => {
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  let getPicture = (event: any) => {
    if (event.target.files.length === 1 && event.target.files[0].type.indexOf('image/') === 0) {
      let temp_image = new Image();
      temp_image.src = URL.createObjectURL(event.target.files[0]);
      temp_image.onload = function () {
        drawImageProp(context, temp_image);
        bindings.setImage(canvas.toDataURL());
        config.projector.scheduleRender();
      };
    }
  };

  let setInitialImageAfterCreate = (element: HTMLCanvasElement) => {
    canvas = element;
    context = canvas.getContext('2d');
    let image = bindings.getImage();
    if (image) {
      let img = new Image();
      img.src = bindings.getImage();
      context.drawImage(img, 0, 0, 240, 240);
    }
  };

  return {
    renderMaquette: () => {
      let image = bindings.getImage();
      return h('div.live-camera-holder', [
        h('label.button', [
          h('input', {
            style: 'display:none',
            type: 'file',
            capture: 'camera',
            accept: 'image/*',
            id: 'takePictureField',
            onchange: getPicture
          }),
          'Take a picture'
        ]),
        h('canvas', { id: 'canvas', styles: {display: image ? undefined: 'none'}, width: '240', height: '240', afterCreate: setInitialImageAfterCreate })
      ]);
    }
  };
};
