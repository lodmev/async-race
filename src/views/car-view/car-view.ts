import './car-view.scss';
import flag from '../../assets/images/finish-flag.png';
import { createElement, setAttributes } from '../../utils/dom-helpers';
import { Car } from '../../models/models';
import animation from '../../utils/request-animation';
import { APPROXIMATE_FRAME_TIME, ZERO } from '../../models/constants';
import CarElement from './car';

export default class CarView {
  private carBlock = createElement('div', 'car-block');

  private car: HTMLElement;

  private finishFlag = createElement('img', 'finish-flag');

  private carNameHeader = createElement('span', 'car-name');

  private raceDistance: number;

  private carAnimation = animation(this.drawFrame.bind(this));

  private isTimeToFinish = false;

  raceDuration: number;

  id: number;

  name: string;

  color: string;

  moveButton = createElement('button', 'move-button');

  resetButton = createElement('button', 'stop-button');

  selectButton = createElement('button', 'select-button');

  removeButton = createElement('button', 'remove-button');

  constructor({ name, color, id }: Car) {
    this.raceDistance = 0;
    this.raceDuration = 0;
    this.id = id;
    this.name = name;
    this.color = color;
    this.car = new CarElement(this.color).view;
    this.carNameHeader.innerText = name;
    setAttributes(this.finishFlag, ['src', flag], ['alt', 'finish flag']);
    this.carBlock.append(this.createCarContainer(), this.finishFlag);
  }

  get view() {
    return this.carBlock;
  }

  createCarContainer() {
    const moveButtons = createElement('div', 'car-container');
    this.moveButton.innerText = 'G';
    this.resetButton.setAttribute('disabled', '');
    this.resetButton.innerText = 'S';
    this.selectButton.innerText = 'SELECT';
    this.removeButton.innerText = 'REMOVE';
    moveButtons.append(
      this.moveButton,
      this.resetButton,
      this.selectButton,
      this.removeButton,
      this.carNameHeader,
      this.car
    );
    return moveButtons;
  }

  calculateDistance() {
    const carBlockWidth =
      parseInt(window.getComputedStyle(this.carBlock).width, 10) ||
      this.carBlock.clientWidth;
    if (carBlockWidth === ZERO) return;
    const carWidth =
      parseInt(window.getComputedStyle(this.car).width, 10) ||
      this.car.clientWidth;
    const stopButtonWidth =
      parseInt(window.getComputedStyle(this.resetButton).width, 10) ||
      this.resetButton.clientWidth;
    const additionalWidth = 15;
    this.raceDistance =
      carBlockWidth - stopButtonWidth - carWidth - additionalWidth;
  }

  drawFrame(progress: number) {
    let offset: number;
    const targetOffset = this.raceDistance;
    const oneSixteenth = this.raceDistance / APPROXIMATE_FRAME_TIME;
    if (this.isTimeToFinish) {
      offset = targetOffset;
    } else {
      offset = Math.min(progress * oneSixteenth, targetOffset);
    }
    this.car.style.transform = `translateX(${offset}px)`;
    return offset === targetOffset;
  }

  run(duration: number) {
    this.raceDuration = duration;
    this.resetButton.removeAttribute('disabled');
    this.carAnimation.start(duration);
  }

  broken() {
    this.isTimeToFinish = false;
    this.carAnimation.cancel();
    this.car.classList.add('broken');
  }

  reset() {
    this.moveButton.removeAttribute('disabled');
    this.car.classList.remove('broken');
    this.isTimeToFinish = false;
    this.car.style.transform = '';
    this.carAnimation.cancel();
  }

  finish() {
    this.isTimeToFinish = true;
  }
}
