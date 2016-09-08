/*
* this component handles the sending of messages into a chat.
*/

import {h, Projector} from 'maquette';
import {createVoiceControlledTextField} from '../components/voice-controlled-text-field';
require('../styles/message-composer.scss');

export interface MessageComposerConfig {
  projector: Projector;
}

export interface MessageComposerBindings {
  sendMessage(text: string): void;
}

export let createMessageComposer = (config: MessageComposerConfig, bindings: MessageComposerBindings) => {
  let {projector} = config;
  let textToSend = '';
  let element: HTMLElement;

  let sendMessage = () => {
    if (textToSend.trim() !== '') { // do not send empty messages, or only spaces
      bindings.sendMessage(textToSend);
      textToSend = '';
    }
  };

  let handleAfterCreate = (createdElement: HTMLElement) => {
    element = createdElement;
  }

  let handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.which === 13) { // enter
      evt.preventDefault();
      sendMessage();
    }
  };

  let handleInput = (evt: Event) => {
    textToSend = (evt.target as HTMLInputElement).value;
  };

  let handleSendClick = (evt: Event) => {
    evt.preventDefault();
    sendMessage();
    (element.querySelector('input') as HTMLInputElement).focus();
  };

  let textfield = createVoiceControlledTextField({label: '', projector: projector}, {
    getValue: () => textToSend,
    setValue: (value) => {textToSend = value; },
    onInput: handleInput,
    onKeyDown: handleKeyDown });

  return {
    renderMaquette: () => {
      return h('div', { class: 'messageComposer', afterCreate: handleAfterCreate }, [
        textfield.renderMaquette(),
        h('button', { class: 'send', onclick: handleSendClick })
      ]);
    }
  };
};
