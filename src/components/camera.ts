import {h, Projector} from 'maquette';
import {createButton} from './button';

require('../styles/camera.scss');

export interface CameraConfig {
  projector: Projector;
}

export interface CameraBindings { }

export let createCamera = (config: CameraConfig, bindings: CameraBindings) => {
  let {projector} = config;
  let n = <any>navigator;
  let window = <any>Window;
  let videoElement: HTMLVideoElement;

  let videoSources: string[];
  let audioSources: string[];

  let currentVideoSourceIndex: number;
  let currentAudioSourceIndex: number;

  let multipleCamerasAvailable: boolean;

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

    let audioSource = audioSources[currentAudioSourceIndex];
    let videoSource = videoSources[currentVideoSourceIndex];
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

  let gotSources = (sourceInfos: any) => {
    for (let i = 0; i !== sourceInfos.length; ++i) {
      let sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'audioinput') {
        audioSources.push(sourceInfo.deviceId);
      } else if (sourceInfo.kind === 'videoinput') {
        videoSources.push(sourceInfo.deviceId);
      } else {
       // console.log('Some other kind of source: ', sourceInfo);
      }
    }
    if (videoSources.length > 1 && !multipleCamerasAvailable) {
      multipleCamerasAvailable = true;
      projector.scheduleRender();
    }
  };

  let initializeDevices = () => {
    if (!n.mediaDevices || !n.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }
    n.mediaDevices.enumerateDevices()
      .then(function (devices: any) {
        gotSources(devices);
         start();
      })
      .catch(function (err: Error) {
        console.error(err.name + ': ' + err.message);
      });
      console.log(videoSources);
  };

  let handleSwitchButtonClick = () => {
    if ( multipleCamerasAvailable ) {
      if (currentVideoSourceIndex < videoSources.length - 1) {
        currentVideoSourceIndex++;
      } else {
        currentVideoSourceIndex = 0;
      }
      start();
    }
  };

  let createElementsAfterCreate = () => {
    videoElement = <HTMLVideoElement>document.querySelector('video');
    videoSources = [];
    audioSources = [];
    currentVideoSourceIndex = 0;
    currentAudioSourceIndex = 0;
    multipleCamerasAvailable = false;
    initializeDevices();
  };

  return {
    renderMaquette: () => {
      return h('div', { class: 'container' }, [
        multipleCamerasAvailable ? createButton({ text: 'Switch camera', primary: false }, { onClick: handleSwitchButtonClick }).renderMaquette() : undefined,
        h('video', { autoplay: true, afterCreate: createElementsAfterCreate })
      ]);
    }
  };
};
