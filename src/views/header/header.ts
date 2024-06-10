import { createElement } from '../../utils/dom-helpers';
import './header.scss';

export default class Header {
  private element = createElement('div', 'header');

  count = createElement('span', 'header_count');

  constructor(header: string, bracketLeft = ' ( ', bracketRight = ' )') {
    this.element.append(header, bracketLeft, this.count, bracketRight);
  }

  get view() {
    return this.element;
  }

  updateCount(count: number) {
    this.count.innerText = `${count}`;
  }
}
