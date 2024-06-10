import carsModels from '../models/cars-models';
import { HEX_BASE } from '../models/constants';

function getRandomIndex(length: number) {
  const index = Math.floor(Math.random() * length);
  const lastChoice = window.localStorage.getItem('lastChoice');
  if (index.toString() === lastChoice) {
    return getRandomIndex(length);
  }
  window.localStorage.setItem('lastChoice', index.toString());
  return index;
}
export function getRandomCar() {
  const randomBrand = carsModels[getRandomIndex(carsModels.length)];
  const brandModels = randomBrand.models;
  const randomModel = brandModels[getRandomIndex(brandModels.length)];
  return `${randomBrand.brand} ${randomModel}`;
}

export function getRandomColor() {
  const absoluteWhite = 16777215; // 0xffffff
  const darkest = 1381653; // 0x151515 but not black
  const randomColor = Math.floor(
    Math.random() * (absoluteWhite - darkest) + darkest
  );
  return `#${randomColor.toString(HEX_BASE)}`;
}
