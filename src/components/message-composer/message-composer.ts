import {h} from 'maquette';
let styles = <any>require('./message-composer.css');

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
      return h('div', { class: styles.messageComposer }, [
        h('input', { class: styles.input, value: textToSend, oninput: handleInput, onkeydown: handleKeyDown }),
        h('button', { class: styles.send, onclick: handleSendClick }, ['Send'])
      ]);
    }
  };
};
