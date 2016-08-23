/*
* This component returns a text-field, but also with a button to start voice control.
* it uses the webkitSpeechRecognition API, which is handled by the recognition variable.
*/

import {Projector, h} from 'maquette';
require('../styles/text-field.scss');

declare let webkitSpeechRecognition: any;

export interface VoiceControlledTextFieldConfig {
  label: string;
  prefilled?: boolean; // this property decides wheter the background of the textfield will be yellow when shown
  projector: Projector;
}

export interface VoiceControlledTextFieldBindings {
  getValue: () => string;
  setValue: (value: string) => void;
  onInput?: (evt: Event) => void;
  onKeyDown?: (evt: KeyboardEvent) => void;
}

export let createVoiceControlledTextField = (config: VoiceControlledTextFieldConfig, bindings: VoiceControlledTextFieldBindings) => {
  let {label, prefilled, projector} = config;
  let {getValue, setValue, onInput, onKeyDown} = bindings;

  let recognizedSpeech = '';
  let isListening = false;
  let startStopButtonText = '';
  let speechApiSupported = true;

  let handleInput = () => {
    let inputField = <HTMLInputElement>document.getElementsByClassName('input')[0];
    setValue(inputField.value);
    prefilled = false;
  };

let recognition: any;

let stopListening = () => {
  recognition.stop();
  startStopButtonText = '';
  projector.scheduleRender();
};

let startListening = () => {
  console.log('start listtening');

  console.log(recognition);
  recognition.start();
  startStopButtonText = '';
  projector.scheduleRender();
};

let startOrStopListening = () => {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
  isListening = !isListening;
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
          console.log('final');

          stopListening();
        } else {
          // i.e. interim. You can use these results to give the user near real time experience.
          recognizedSpeech = event.results[i][0].transcript;
          console.log('interim');

        }
      }
      console.log('ok');
      projector.scheduleRender();
    };
  }

  let textField = {
    renderMaquette: () => {
      return h('label', { class: 'textField', key: textField }, [
        h('span', { class: 'label' }, [label]),
        h('div', {class: 'voicecontrollinputholder'}, [
          h('input', { class: 'input', classes: {'prefilled': prefilled}, oninput: onInput , onkeydown: onKeyDown, type: 'text',
          value: isListening ? recognizedSpeech : getValue()}),
          isListening ? h('img', {class: 'voice-control-animation', src: 'icons/voice-spinner.gif', onclick: startOrStopListening}) :
          speechApiSupported ? h('button', { class: 'voice-control-button', onclick: startOrStopListening }, [startStopButtonText]) : undefined
        ])
      ]);
    }
  };
  return textField;
};
