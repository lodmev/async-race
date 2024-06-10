import { createElement } from '../../utils/dom-helpers';
import Header from '../header/header';
import './paginator-view.scss';

export default class PaginateView {
  header: Header;

  controls = createElement('section', 'pagination-controls');

  nextButton = createElement('button', 'next-button');

  prevButton = createElement('button', 'prev-button');

  constructor() {
    this.header = new Header('Page', ' #', '');
    this.header.view.classList.add('paginator');
    this.nextButton.setAttribute('disabled', '');
    this.nextButton.innerText = 'next page';
    this.prevButton.setAttribute('disabled', '');
    this.prevButton.innerText = 'prev page';

    this.controls.append(this.prevButton, this.nextButton);
  }

  update(totalCount: number, itemsPerPage: number, currentPage: number) {
    this.header.updateCount(currentPage);
    const pagesCount = Math.ceil(totalCount / itemsPerPage);
    if (pagesCount) {
      // eslint-disable-next-line no-magic-numbers
      if (currentPage > 1) {
        this.prevButton.removeAttribute('disabled');
      } else {
        this.prevButton.setAttribute('disabled', '');
      }
      if (currentPage < pagesCount) {
        this.nextButton.removeAttribute('disabled');
      } else {
        this.nextButton.setAttribute('disabled', '');
      }
    }
  }
}
