import './winners-view.scss';
import {
  cloneElement,
  copyElement,
  createElement,
} from '../../utils/dom-helpers';
import Header from '../header/header';
import PaginateView from '../paginator/paginate-view';
import { WinnersResponse } from '../../models/models';
import { FIXED_DECIMAL, ONE } from '../../models/constants';
import { getCar } from '../../api/fetch';
import CarElement from '../car-view/car';

function loadCar(id: number, carElement: HTMLElement, name: HTMLElement) {
  getCar(id)
    .then((car) => {
      name.append(car.name);
      carElement.append(new CarElement(car.color).view);
    })
    .catch((reason) => global.sayToast(reason, true));
}

export default class WinnersView {
  element = createElement('section', 'winners');

  winnersTable = createElement('div', 'winners-table');

  winnerTableHeaderElements = Array<HTMLElement>();

  winsHeader = createElement('span', 'sorting-controls');

  bestTimeHeader = cloneElement(this.winsHeader);

  pagination = new PaginateView();

  header: Header;

  constructor() {
    this.header = new Header('Winners');
    this.element.append(
      this.header.view,
      this.pagination.header.view,
      this.winnersTable,
      this.pagination.controls
    );
    this.createWinnersTable();
  }

  get view() {
    return this.element;
  }

  createWinnersTable() {
    const restHeadersColumns = 4;
    const number = createElement('div', 'table-header');
    const [winsHeaderWrapper, bestTimeHeaderWrapper, car, name] = copyElement(
      number,
      restHeadersColumns
    );

    number.innerText = 'Number';
    car.innerText = 'Car';
    name.innerText = 'Name';
    this.winsHeader.innerText = 'Wins';
    winsHeaderWrapper.append(this.winsHeader);
    this.bestTimeHeader.innerText = 'Best time (seconds)';
    bestTimeHeaderWrapper.append(this.bestTimeHeader);
    this.winnerTableHeaderElements.push(
      number,
      car,
      name,
      winsHeaderWrapper,
      bestTimeHeaderWrapper
    );
  }

  update(winnersResponse: WinnersResponse) {
    this.header.count.innerText = winnersResponse.totalCount.toString();
    const tableBody = Array<HTMLElement>();
    winnersResponse.winners.forEach((winner, index) => {
      const number = createElement('div', '');
      const restRowElCount = 4;
      const [car, name, wins, bestTime] = copyElement(number, restRowElCount);
      number.innerText = `${index + ONE}`;
      wins.innerText = `${winner.wins}`;
      bestTime.innerText = `${winner.time.toFixed(FIXED_DECIMAL)}`;
      loadCar(winner.id, car, name);
      tableBody.push(number, car, name, wins, bestTime);
    });
    this.winnersTable.replaceChildren(
      ...this.winnerTableHeaderElements,
      ...tableBody
    );
  }
}
