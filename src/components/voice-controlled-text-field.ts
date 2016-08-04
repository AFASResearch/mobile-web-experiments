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

  if (!('webkitSpeechRecognition' in window)) {
      //Speech API not supported here…
  } else { //Let’s do some cool stuff :)
      var recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process.
      recognition.continuous = true;   //Suitable for dictation.
      recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
      //Define some more additional parameters for the recognition:
      recognition.lang = "nl_NL";
      recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...

      recognition.onstart = function() {
          //Listening (capturing voice from audio input) started.
          //This is a good place to give the user visual feedback about that (i.e. flash a red light, etc.)
          console.log(' started listening ')
          isListening = true;
          projector.scheduleRender();

      };

      recognition.onend = function() {
          console.log(' stopped listening ')
          isListening = false;
          startStopButtonText = 'start listening';

          projector.scheduleRender();

      };

      recognition.onresult = function(event: any) { //the event holds the results
          //Yay – we have results! Let’s check if they are defined and if final or not:
          if (typeof(event.results) === 'undefined') { //Something is wrong…
              recognition.stop();
              startStopButtonText = 'start listening';
              return;
          }

          for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) { // Final results
                  console.log("final results: " + event.results[i][0].transcript);   //Of course – here is the place to do useful things with the results.
                  recognizedSpeech = event.results[i][0].transcript;
              } else {   //i.e. interim...
                  console.log("interim results: " + event.results[i][0].transcript);  //You can use these results to give the user near real time experience.
                  recognizedSpeech = event.results[i][0].transcript;
              }
          } //end for loop
          projector.scheduleRender();
      };
  }

  let startOrStopListening = () => {
    if (isListening) {
      recognition.stop();
      startStopButtonText = 'start listening';
      console.log('I stop listening now...');
    } else {
      recognition.start();
      startStopButtonText = 'stop listening';
      console.log('I start listening now...');
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
