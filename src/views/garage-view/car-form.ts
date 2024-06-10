import { createElement, setAttributes } from '../../utils/dom-helpers';
import './car-form.scss';

export default class CarForm {
  element = createElement('form', 'car-form');

  textInput = createElement('input', 'car-form__text-field');

  colorInput = createElement('input', 'car-form__color-field');

  submitInput = createElement('input', 'button car-form__submit-field');

  currentCarId: number;

  constructor() {
    this.currentCarId = -1;
    setAttributes(this.textInput, ['type', 'text'], ['required', '']);
    setAttributes(this.colorInput, ['type', 'color'], ['value', '#99e6ff']);
    setAttributes(this.submitInput, ['type', 'submit'], ['value', 'CREATE']);
    this.element.append(this.textInput, this.colorInput, this.submitInput);
  }

  get view() {
    return this.element;
  }
}
