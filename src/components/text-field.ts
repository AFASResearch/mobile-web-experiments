import {h} from 'maquette';
require('../styles/text-field.scss');

export interface TextFieldConfig {
  label: string;
  prefilled?: boolean;
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
      return h('div.input-holder', { class: 'textField', key: textField }, [
        h('label', { class: 'label', for: label  }, [label]),
        h('div', {class: 'voicecontrollinputholder'}, [
          h('input', {
            class: 'input',
            classes: {'prefilled': prefilled},
            type: 'text',
            value: getValue(),
            oninput: handleInput,
            id: label
          })
        ])
      ]);
    }
  };
  return textField;
};
