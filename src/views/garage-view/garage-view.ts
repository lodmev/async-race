import './garage-view.scss';
import { createElement } from '../../utils/dom-helpers';
import CarView from '../car-view/car-view';
import Header from '../header/header';
import PaginateView from '../paginator/paginate-view';
import CarForm from './car-form';

export default class GarageView implements GarageView {
  private element = createElement('section', 'garage');

  private header = new Header('Garage');

  private cars = createElement('section', 'cars');

  private controls = createElement('section', 'garage-controls');

  paginateView = new PaginateView();

  raceButton = createElement('button', 'race-button');

  resetButton = createElement('button', 'reset-button');

  generateButton = createElement('button', 'generate-button');

  createCarForm = new CarForm();

  changeCarForm = new CarForm();

  constructor() {
    this.raceButton.innerText = 'race';
    this.resetButton.innerText = 'reset';
    this.generateButton.innerText = 'generate cars';
    this.resetButton.setAttribute('disabled', '');
    const buttonControls = createElement('div', 'button-controls');
    this.changeCarForm.textInput.setAttribute('disabled', '');
    this.changeCarForm.submitInput.setAttribute('value', 'UPDATE');
    buttonControls.append(
      this.raceButton,
      this.resetButton,
      this.generateButton
    );
    this.controls.append(
      this.createCarForm.view,
      this.changeCarForm.view,
      buttonControls
    );
    this.element.append(
      this.controls,
      this.header.view,
      this.paginateView.header.view,
      this.cars,
      this.paginateView.controls
    );
  }

  get view() {
    return this.element;
  }

  updateView(cars: CarView[], totalCount: number) {
    this.header.updateCount(totalCount);
    this.cars.replaceChildren(...cars.map((car) => car.view));
  }

  showError(err: unknown) {
    if (err instanceof Error) {
      // TODO make error window
      this.element.replaceChildren(err.message);
    }
  }
}
