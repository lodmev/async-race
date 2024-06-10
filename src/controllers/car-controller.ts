import { ServerError } from '../api/errors';
import { requestToDrive, requestToStartStop } from '../api/fetch';
import {
  DEFAULT_INCREMENT,
  FIRST_ARRAY_INDEX,
  ONE,
  ZERO,
} from '../models/constants';
import { Car } from '../models/models';
import CarView from '../views/car-view/car-view';

export default class CarsController {
  carsOnPage: Record<number, CarView> = {};

  carChangeHandlers =
    Array<(action: 'select' | 'remove', carView: CarView) => void>();

  carEvent(action: 'select' | 'remove', carView: CarView) {
    for (let i = ZERO; i < this.carChangeHandlers.length; i += ONE) {
      this.carChangeHandlers[i](action, carView);
    }
  }

  updateCars(cars: Car[]) {
    this.carsOnPage = {};
    for (let i = FIRST_ARRAY_INDEX; i < cars.length; i += DEFAULT_INCREMENT) {
      const carView = new CarView(cars[i]);
      carView.moveButton.addEventListener('click', () => {
        carView.moveButton.setAttribute('disabled', '');
        CarsController.runCar(carView).then(
          () => {},
          () => {}
        );
      });
      carView.resetButton.addEventListener('click', () => {
        carView.resetButton.setAttribute('disabled', '');
        CarsController.resetCar(carView).then(
          () => {},
          () => {}
        );
      });
      carView.removeButton.addEventListener('click', () => {
        this.carEvent('remove', carView);
        carView.view.remove();
      });
      carView.selectButton.addEventListener('click', () => {
        this.carEvent('select', carView);
      });
      this.carsOnPage[cars[i].id] = carView;
    }
  }

  static resetCar(carView: CarView) {
    return new Promise<void>((resolve) => {
      requestToStartStop(carView.id, true)
        .catch((reason) => {
          if (reason instanceof Error) {
            global.sayToast(reason.toString(), true);
          }
        })
        .finally(() => {
          carView.reset();
          resolve();
        });
    });
  }

  static runCar(carView: CarView): Promise<CarView> {
    return new Promise((resolve, reject) => {
      carView.moveButton.setAttribute('disabled', '');
      carView.calculateDistance();
      requestToStartStop(carView.id)
        .then((time) => carView.run(time))
        .catch((reason) => {
          if (reason instanceof Error) {
            global.sayToast(reason.toString(), true);
          }
          reject(reason);
        })
        .then(() => requestToDrive(carView.id))
        .then(() => {
          carView.finish();
          resolve(carView);
        })
        .catch((reason: unknown) => {
          if (reason instanceof Error) {
            if (reason instanceof ServerError) {
              carView.broken();
            } else {
              global.sayToast(reason.toString(), true);
            }
          }
          reject(reason);
        });
    });
  }

  startRace(): Promise<CarView> {
    const raceParticipants = Array<Promise<CarView>>();
    Object.values(this.carsOnPage).forEach((carView) =>
      raceParticipants.push(CarsController.runCar(carView))
    );
    return Promise.any(raceParticipants);
  }

  resetRace() {
    const resetResult = Array<Promise<void>>();
    Object.values(this.carsOnPage).forEach((carView) =>
      resetResult.push(CarsController.resetCar(carView))
    );
    return Promise.allSettled(resetResult);
  }
}
