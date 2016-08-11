/*
* this component handles the sending of messages into a chat. 
*/

import {h} from 'maquette';
require('../styles/message-composer.scss');

export interface MessageComposerBindings {
  sendMessage(text: string): void;
}

export let createMessageComposer = (bindings: MessageComposerBindings) => {
  let textToSend = '';
  let handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.which === 13) {
      evt.preventDefault();
      bindings.sendMessage(textToSend);
      textToSend = '';
    }
  };

  let handleInput = (evt: Event) => {
    textToSend = (evt.target as HTMLInputElement).value;
  };

  let handleSendClick = (evt: Event) => {
    evt.preventDefault();
    bindings.sendMessage(textToSend);
    textToSend = '';
  };

  return {
    renderMaquette: () => {
      return h('div', { class: 'messageComposer' }, [
        h('input', { class: 'input', value: textToSend, oninput: handleInput, onkeydown: handleKeyDown }),
        h('button', { class: 'send', onclick: handleSendClick }, ['Send'])
      ]);
    }
  };
};
