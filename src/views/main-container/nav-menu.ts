import './nav-menu.scss';
import { DEFAULT_INCREMENT, FIRST_ARRAY_INDEX } from '../../models/constants';
import { Pages } from '../../models/enums';
import { createElement } from '../../utils/dom-helpers';

type Item = {
  pageIndex: Pages;
  pageName: string;
};

export default class NavMenu {
  private element = createElement('nav', 'nav');

  menuItems = Array<HTMLAnchorElement>();

  constructor(menuItems: Item[]) {
    for (
      let i = FIRST_ARRAY_INDEX;
      i < menuItems.length;
      i += DEFAULT_INCREMENT
    ) {
      const itemIndex = menuItems[i].pageIndex;
      const item = createElement('a', 'menu-item');
      item.innerText = menuItems[i].pageName;
      this.element.append(item);
      // eslint-disable-next-line no-magic-numbers
      const lastItemIndex = menuItems.length - 1;
      if (i < lastItemIndex) {
        const divider = createElement('div', '');
        divider.innerText = '/';
        this.element.append(divider);
      }
      this.menuItems[itemIndex] = item;
    }
  }

  get view() {
    return this.element;
  }

  setActive(itemIndex: Pages) {
    this.menuItems.forEach((item) => item.classList.remove('active'));
    this.menuItems[itemIndex].classList.add('active');
  }
}
