import MainContainer from '../views/main-container/main-container';
import NavMenu from '../views/main-container/nav-menu';

export type Car = {
  name: string;
  color: string;
  id: number;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type GarageResponse = {
  cars: Car[];
  totalCount: number;
};

export type WinnersResponse = {
  winners: Winner[];
  totalCount: number;
};

export interface GarageView {
  view: HTMLElement;
  showError: (err: unknown) => void;
}
export interface GarageController {
  garageView: GarageView;
  updateCars(garageResponse: GarageResponse): void;
  race(): void;
  updateState(): void;
}

export interface WinnersController {
  view: HTMLElement;
  updateState: () => void;
}

export interface Application {
  root: HTMLElement;

  mainMenu: NavMenu;

  mainContainer: MainContainer;

  garageController: GarageController;

  winnersController: WinnersController;
}
