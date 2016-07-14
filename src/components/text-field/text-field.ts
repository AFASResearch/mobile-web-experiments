import {h} from 'maquette';
let styles = <any>require('./text-field.css');

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
      return h('label', { class: styles.textField, key: textField }, [
        h('span', { class: styles.label }, [config.label]),
        h('input', { class: styles.input, type: 'text', value: getValue(), oninput: handleInput })
      ]);
    }
  };
  return textField;
};
