import {h} from 'maquette';
require('../styles/text-field.scss');

export interface TextFieldConfig {
  label: string;
}

export interface TextFieldBindings {
  getValue: () => string;
  setValue: (value: string) => void;
}

export let createTextField = (config: TextFieldConfig, bindings: TextFieldBindings) => {
  let {getValue, setValue} = bindings;

  let handleInput = (evt: Event) => {
    setValue((evt.target as HTMLInputElement).value);
  };

  let textField = {
    renderMaquette: () => {
      return h('label', { class: 'textField', key: textField }, [
        h('span', { class: 'label' }, [config.label]),
        h('input', { class: 'input', type: 'text', value: getValue(), oninput: handleInput })
      ]);
    }
  };
  return textField;
};
