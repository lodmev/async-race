import { createElement } from '../../utils/dom-helpers';
import carSvg from '../../assets/images/car.svg';

export default class CarElement {
  element = createElement('div', 'car');

  constructor(color: string) {
    this.element.innerHTML = carSvg;
    this.element.style.fill = color;
  }

  get view() {
    return this.element;
  }
}
