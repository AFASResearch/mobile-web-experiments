/*
* This component returns a text-field, but also with a button to start voice control.
* it uses the webkitSpeechRecognition API, which is handled by the recognition variable.
*/

import {Projector, h} from 'maquette';
require('../styles/text-field.scss');

declare let webkitSpeechRecognition: any;

export interface VoiceControlledTextFieldConfig {
  label: string;
  prefilled?: boolean;
  projector: Projector;
}

export interface VoiceControlledTextFieldBindings {
  getValue: () => string;
  setValue: (value: string) => void;
}

export let createVoiceControlledTextField = (config: VoiceControlledTextFieldConfig, bindings: VoiceControlledTextFieldBindings) => {
  let {label, prefilled, projector} = config;
  let {getValue, setValue} = bindings;

  let recognizedSpeech = '';
  let isListening = false;
  let startStopButtonText = 'start listening';
  let speechApiSupported = true;

  let handleInput = () => {
    let inputField = <HTMLInputElement>document.getElementsByClassName('input')[0];
    setValue(inputField.value);
    prefilled = false;
  };

let recognition: any;

let stopListening = () => {
  recognition.stop();
  startStopButtonText = 'start listening';
  projector.scheduleRender();
};

let startListening = () => {
  recognition.start();
  startStopButtonText = 'stop listening';
  projector.scheduleRender();
};

  if (!('webkitSpeechRecognition' in window)) {
    // Speech API not supported here…
    console.log('speech api is not supported.');
    speechApiSupported = false;

    // ensure that islistening is always false.
    isListening = false;
  } else {
    recognition = new webkitSpeechRecognition(); // That is the object that will manage our whole recognition process.
    recognition.continuous = true;   // Suitable for dictation.
    recognition.interimResults = true;  // If we want to start receiving results even if they are not final.
    recognition.lang = 'nl_NL';
    recognition.maxAlternatives = 1; // the highest result is the best.

    recognition.onstart = function() {
      // here we could do things when the recognition has started. i.e. animations.
    };

    recognition.onend = function() {
      stopListening();
    };

    recognition.onresult = function(event: any) { // the event holds the results
      if (typeof(event.results) === 'undefined') {
        stopListening();
        return;
      }

      for (let i = event.resultIndex; i < event.results.length; ++i) {

        // there is a result so we can already store that
        handleInput();

        if (event.results[i].isFinal) {
          // Final results; here is the place to do useful things with the results.
          recognizedSpeech = event.results[i][0].transcript;
        } else {
          // i.e. interim. You can use these results to give the user near real time experience.
          recognizedSpeech = event.results[i][0].transcript;
        }
      }
      projector.scheduleRender();
    };
  }

  let startOrStopListening = () => {
    console.log(isListening);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    isListening = !isListening;
  };

  let textField = {
    renderMaquette: () => {
      return h('label', { class: 'textField', key: textField }, [
        h('span', { class: 'label' }, [label]),
        h('div', {class: 'voicecontrollinputholder'}, [
          h('input', { class: 'input', classes: {'prefilled': prefilled}, type: 'text',
          value: isListening ? recognizedSpeech : getValue(), oninput: handleInput}),
          isListening ? h('img', { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cochlea_wave_animated.gif'}) : undefined,
          speechApiSupported ? h('button', { class: 'button', onclick: startOrStopListening }, [startStopButtonText]) : undefined
        ])
      ]);
    }
  };
  return textField;
};
