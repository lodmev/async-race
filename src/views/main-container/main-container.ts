import './main-container.scss';
import { Pages } from '../../models/enums';
import { createElement } from '../../utils/dom-helpers';
import NavMenu from './nav-menu';
import toastElement from './toast';

export default class MainContainer {
  private element = createElement('div', 'main-container');

  private errorPage = createElement('div', 'main-error');

  private pageView = createElement('main', 'main');

  private pages: HTMLElement[];

  navMenu: NavMenu;

  constructor(navMenu: NavMenu, ...pages: HTMLElement[]) {
    this.pages = pages;
    this.navMenu = navMenu;
    this.element.append(toastElement, navMenu.view, this.pageView);
  }

  get view() {
    return this.element;
  }

  switchPage(pageIndex: Pages) {
    this.navMenu.setActive(pageIndex);
    this.pageView.replaceChildren(this.pages[pageIndex]);
  }

  showError(msg: string) {
    this.errorPage.innerText = msg;
    this.element.replaceChildren(this.errorPage);
  }
}
