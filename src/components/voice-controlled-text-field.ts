import {Projector, h} from 'maquette';
require('../styles/text-field.scss');

export interface VoiceControlledTextFieldConfig {
  label: string;
  prefilled?:  boolean;
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

  let stopListening = () => {
    recognition.stop();
    startStopButtonText = 'start listening';
    isListening = false;
    projector.scheduleRender();
  }

  let startListening = () => { config
    recognition.start();
    startStopButtonText = 'stop listening';
    isListening = true;
    projector.scheduleRender();
  }

  if (!('webkitSpeechRecognition' in window)) {
    //Speech API not supported here…
    console.log('speech api is not supported :(')
  } else { //Let’s do some cool stuff :)
    var recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process.
    recognition.continuous = true;   //Suitable for dictation.
    recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
    //Define some more additional parameters for the recognition:
    recognition.lang = "nl_NL";
    recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...

    recognition.onstart = function() {
      // here we could do things when the recognition has started. i.e. animations.
    };

    recognition.onend = function() {
      stopListening();
    };

    recognition.onresult = function(event: any) { //the event holds the results
      if (typeof(event.results) === 'undefined') { //Something is wrong…
        recognition.stop();
        startStopButtonText = 'start listening';
        return;
      }

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // Final results; here is the place to do useful things with the results.
          console.log("final results: " + event.results[i][0].transcript);
          recognizedSpeech = event.results[i][0].transcript;
        } else {
          // i.e. interim. You can use these results to give the user near real time experience.
          console.log("interim results: " + event.results[i][0].transcript);
          recognizedSpeech = event.results[i][0].transcript;
        }
      }
      projector.scheduleRender();
    };
  }

  let startOrStopListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    isListening = !isListening;
  }

  // let handleInput = (evt: Event) => {
  //   setValue((evt.target as HTMLInputElement).value);
  //   prefilled = false;
  // };

  let textField = {
    renderMaquette: () => {
      return h('label', { class: 'textField', key: textField }, [
        h('span', { class: 'label' }, [label]),
        h('div', {class: 'voicecontrollinputholder'}, [
          h('input', { class: 'input', classes: {'prefilled': prefilled}, type: 'text', value: recognizedSpeech}),
          isListening ? h('img', { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cochlea_wave_animated.gif'}) : undefined,
          h('button', { class: 'button', onclick: startOrStopListening }, [startStopButtonText])
        ])
      ]);
    }
  };
  return textField;
};
