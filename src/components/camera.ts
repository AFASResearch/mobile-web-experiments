import {h, Projector} from 'maquette';

export interface CameraConfig {
  projector: Projector;
}

export interface CameraBindings { }

export let createCamera = (config: CameraConfig, bindings: CameraBindings) => {
  let n = <any>navigator;
  let window = <any>Window;
  let videoElement: HTMLVideoElement;
  let audioSelect: HTMLSelectElement;
  let videoSelect: HTMLSelectElement;
  n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;

  let successCallback = (stream: any) => {
    window.stream = stream; // make stream available to console
    videoElement.src = URL.createObjectURL(stream);
    videoElement.play();
  };

  let errorCallback = (error: any) => {
    console.log('navigator.getUserMedia error: ', error);
  };

  let start = () => {
    if (window.stream) {
      videoElement.src = null;
      window.stream.getTracks().forEach(function (track: any) {
        track.stop();
      });
    }

    let audioSource = audioSelect.value;
    let videoSource = videoSelect.value;
    let constraints = {
      audio: {
        optional: [{
          sourceId: audioSource
        }]
      },
      video: {
        optional: [{
          sourceId: videoSource
        }]
      }
    };
    n.getUserMedia(constraints, successCallback, errorCallback);
  };

  let initializeDevices = () => {
    if (!n.mediaDevices || !n.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }

    n.mediaDevices.enumerateDevices()
      .then(function (devices: any) {
        gotSources(devices);
      })
      .catch(function (err: Error) {
        console.error(err.name + ': ' + err.message);
      });
    start();
  };

  let createElementsAfterCreate = () => {
    videoElement = <HTMLVideoElement>document.querySelector('video');
    audioSelect = <HTMLSelectElement>document.querySelector('select#audioSelect');
    videoSelect = <HTMLSelectElement>document.querySelector('select#videoSelect');
    initializeDevices();
  };

  function gotSources(sourceInfos: any) {
    for (let i = 0; i !== sourceInfos.length; ++i) {
      let sourceInfo = sourceInfos[i];
      let option = document.createElement('option');
      option.value = sourceInfo.deviceId;
      option.text = sourceInfo.label;
      if (sourceInfo.kind === 'audioinput') {
        audioSelect.appendChild(option);
      } else if (sourceInfo.kind === 'videoinput') {
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source: ', sourceInfo);
      }
    }
  };

  return {
    renderMaquette: () => {
      return h('div', { class: 'container' }, [
        h('select', { id: 'videoSelect', onchange: start }),
        h('select', { id: 'audioSelect', onchange: start }),
        h('video', { afterCreate: createElementsAfterCreate })
      ]);
    }
  };
};
