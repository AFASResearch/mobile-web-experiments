import {h} from 'maquette';
require('../styles/text-field.scss');

export interface TextFieldConfig {
  label: string;
  prefilled?:  boolean;
}

export interface TextFieldBindings {
  getValue: () => string;
  setValue: (value: string) => void;
}

export let createTextField = (config: TextFieldConfig, bindings: TextFieldBindings) => {
  let {label, prefilled} = config;
  let {getValue, setValue} = bindings;

  let handleInput = (evt: Event) => {
    setValue((evt.target as HTMLInputElement).value);
    prefilled = false;
  };


  let textField = {
    renderMaquette: () => {
      return h('label', { class: 'textField', key: textField }, [
        h('span', { class: 'label' }, [label]),
        h('input', { class: 'input',
          classes: {'prefilled': prefilled},
          type: 'text',
          value: getValue(),
          oninput: handleInput
        })
      ]);
    }
  };
  return textField;
};
