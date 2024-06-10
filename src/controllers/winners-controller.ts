import { getWinners } from '../api/fetch';
import { WINNERS_PER_PAGE } from '../models/constants';
import WinnersView from '../views/winners-view/winners-view';

export default class WinnersController {
  currentPage: number;

  currentSort: 'id' | 'wins' | 'time' = 'id';

  currentOrder: 'ASC' | 'DESC' = 'ASC';

  winnersView = new WinnersView();

  constructor() {
    this.currentPage = 1;
    this.addEventListeners();
  }

  get view() {
    return this.winnersView.view;
  }

  updateState() {
    getWinners(this.currentPage, this.currentSort, this.currentOrder)
      .then((winnersResponse) => {
        this.winnersView.update(winnersResponse);
        this.winnersView.pagination.update(
          winnersResponse.totalCount,
          WINNERS_PER_PAGE,
          this.currentPage
        );
      })
      .catch((reason) => sayToast(reason, true));
  }

  addWinsSortingEventListener() {
    this.winnersView.winsHeader.addEventListener('click', () => {
      this.winnersView.bestTimeHeader.classList.remove('asc', 'desc');
      if (this.winnersView.winsHeader.classList.contains('asc')) {
        // by default
        this.winnersView.winsHeader.classList.remove('asc', 'desc');
        this.currentSort = 'id';
        this.currentOrder = 'ASC';
        this.updateState();
        return;
      }
      this.currentSort = 'wins';
      if (this.currentOrder === 'ASC') {
        this.currentOrder = 'DESC';
        this.winnersView.winsHeader.classList.remove('asc');
        this.winnersView.winsHeader.classList.add('desc');
        this.updateState();
      } else {
        this.currentOrder = 'ASC';
        this.winnersView.winsHeader.classList.remove('desc');
        this.winnersView.winsHeader.classList.add('asc');
        this.updateState();
      }
    });
  }

  addTimeSortingEventListener() {
    this.winnersView.bestTimeHeader.addEventListener('click', () => {
      this.winnersView.winsHeader.classList.remove('asc', 'desc');
      if (this.winnersView.bestTimeHeader.classList.contains('asc')) {
        // by default
        this.winnersView.bestTimeHeader.classList.remove('asc', 'desc');
        this.currentSort = 'id';
        this.currentOrder = 'ASC';
        this.updateState();
        return;
      }
      this.currentSort = 'time';
      if (this.currentOrder === 'ASC') {
        this.currentOrder = 'DESC';
        this.winnersView.bestTimeHeader.classList.remove('asc');
        this.winnersView.bestTimeHeader.classList.add('desc');
        this.updateState();
      } else {
        this.currentOrder = 'ASC';
        this.winnersView.bestTimeHeader.classList.remove('desc');
        this.winnersView.bestTimeHeader.classList.add('asc');
        this.updateState();
      }
    });
  }

  addPaginationListeners() {
    this.winnersView.pagination.prevButton.addEventListener('click', () => {
      this.currentPage -= 1;
      this.updateState();
    });
    this.winnersView.pagination.nextButton.addEventListener('click', () => {
      this.currentPage += 1;
      this.updateState();
    });
  }

  addEventListeners() {
    this.addWinsSortingEventListener();
    this.addTimeSortingEventListener();
    this.addPaginationListeners();
  }
}
