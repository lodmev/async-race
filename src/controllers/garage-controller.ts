import {
  createCar,
  getCars,
  removeCar,
  updateCar,
  writeWinner,
} from '../api/fetch';
import {
  CARS_PER_PAGE,
  DEFAULT_INCREMENT,
  FIXED_DECIMAL,
  GENERATE_COUNT,
  MILLISECONDS,
  ZERO,
} from '../models/constants';
import { Car, GarageResponse } from '../models/models';
import { getRandomCar, getRandomColor } from '../utils/random-car';
import CarView from '../views/car-view/car-view';
import GarageView from '../views/garage-view/garage-view';
import CarsController from './car-controller';
import WinnersController from './winners-controller';

export default class GarageController implements GarageController {
  garageView = new GarageView();

  carsController = new CarsController();

  currentPage: number;

  totalCount: number;

  winnersController: WinnersController;

  constructor(winnersController: WinnersController) {
    this.winnersController = winnersController;
    this.currentPage = 1;
    this.totalCount = 0;
    this.addListeners();
  }

  updateState() {
    this.garageView.raceButton.removeAttribute('disabled');
    this.garageView.resetButton.setAttribute('disabled', '');
    getCars(this.currentPage)
      .then((garageResponse) => {
        this.totalCount = garageResponse.totalCount;
        this.updatePagination();
        this.updateCars(garageResponse);
      })
      .catch((err) => {
        if (err instanceof Error) {
          if (err instanceof TypeError) {
            global.sayToast(
              "Oops... Can't fetch resources. Maybe the API server not running? Check it and reload page",
              true
            );
          } else {
            global.sayToast(err.toString(), true);
          }
        }
      });
  }

  updateCars(garageResponse: GarageResponse) {
    this.carsController.updateCars(garageResponse.cars);
    this.garageView.updateView(
      Object.values(this.carsController.carsOnPage),
      garageResponse.totalCount
    );
  }

  updatePagination() {
    this.garageView.paginateView.update(
      this.totalCount,
      CARS_PER_PAGE,
      this.currentPage
    );
  }

  addRaceButtonListener() {
    this.garageView.raceButton.addEventListener('click', () => {
      this.garageView.raceButton.setAttribute('disabled', '');
      this.race();
    });
  }

  resetCars() {
    this.garageView.resetButton.setAttribute('disabled', '');
    this.carsController.resetRace().then(
      () => {
        this.garageView.raceButton.removeAttribute('disabled');
      },
      () => {}
    );
  }

  addResetButtonListener() {
    this.garageView.resetButton.addEventListener('click', () => {
      this.resetCars();
    });
  }

  addGenerateButtonListener() {
    this.garageView.generateButton.addEventListener('click', () => {
      this.garageView.generateButton.setAttribute('disabled', '');
      const createCarRequests = Array<Promise<Car>>();
      for (let i = ZERO; i < GENERATE_COUNT; i += DEFAULT_INCREMENT) {
        const carName = getRandomCar();
        const carColor = getRandomColor();
        const createRequest = createCar({ name: carName, color: carColor });
        createCarRequests.push(createRequest);
      }
      Promise.allSettled(createCarRequests).then(
        (results) => {
          this.updateState();
          this.garageView.generateButton.removeAttribute('disabled');
          results.forEach((result) => {
            if (result.status === 'rejected') {
              if (result.reason instanceof Error) {
                global.sayToast(result.reason.toString(), true);
              }
            }
          });
        },
        () => {}
      );
    });
  }

  addPaginationListeners() {
    this.garageView.paginateView.prevButton.addEventListener('click', () => {
      this.currentPage -= 1;
      this.updateState();
      this.resetCars();
    });
    this.garageView.paginateView.nextButton.addEventListener('click', () => {
      this.currentPage += 1;
      this.updateState();
      this.resetCars();
    });
  }

  changeCarHandler(carView: CarView) {
    const { changeCarForm } = this.garageView;
    changeCarForm.textInput.removeAttribute('disabled');
    changeCarForm.textInput.value = carView.name;
    changeCarForm.colorInput.setAttribute('value', carView.color);
    changeCarForm.currentCarId = carView.id;
  }

  addCarActionsListener() {
    this.carsController.carChangeHandlers.push((action, carView) => {
      switch (action) {
        case 'remove':
          removeCar(carView.id)
            .then(() => {
              this.winnersController.updateState();
            })
            .catch((reason) => global.sayToast(reason));
          break;
        case 'select':
          this.changeCarHandler(carView);
          break;
        default:
        //
      }
    });
  }

  addCarFormsEventListeners() {
    const { changeCarForm, createCarForm } = this.garageView;
    changeCarForm.view.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const name = changeCarForm.textInput.value;
      const color = changeCarForm.colorInput.value;
      updateCar(changeCarForm.currentCarId, { name, color })
        .then((responseOk) => {
          if (!responseOk) {
            global.sayToast(`can't update car`);
          } else {
            this.winnersController.updateState();
            this.updateState();
          }
        })
        .catch((reason) => global.sayToast(reason))
        .finally(() => {
          changeCarForm.textInput.value = '';
          changeCarForm.textInput.setAttribute('disabled', '');
        });
    });
    createCarForm.view.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = createCarForm.textInput.value;
      const color = createCarForm.colorInput.value;
      createCar({ name, color })
        .then(() => {
          this.updateState();
        })
        .catch((reason) => global.sayToast(reason, true))
        .finally(() => {
          createCarForm.textInput.value = '';
        });
    });
  }

  addListeners() {
    this.addCarActionsListener();
    this.addCarFormsEventListeners();
    this.addRaceButtonListener();
    this.addResetButtonListener();
    this.addGenerateButtonListener();
    this.addPaginationListeners();
  }

  race() {
    this.garageView.paginateView.nextButton.setAttribute('disabled', '');
    this.garageView.paginateView.prevButton.setAttribute('disabled', '');
    this.carsController.startRace().then(
      (carView) => {
        const time = carView.raceDuration / MILLISECONDS;
        this.garageView.resetButton.removeAttribute('disabled');
        global.sayToast(
          `Winner: ${carView.name}, time: ${time.toFixed(FIXED_DECIMAL)}s`
        );
        writeWinner(carView.id, time)
          .then(() => {
            this.winnersController.updateState();
            this.updatePagination();
          })
          .catch((reason) => {
            if (reason instanceof Error) {
              global.sayToast(reason.toString(), true);
            }
          });
      },
      () => {}
    );
  }
}
