import { Pages } from '../models/enums';
import { Application } from '../models/models';
// import { Car } from '../models/models';

export default class AppController {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  start() {
    this.setMenuItemClick();
    this.app.garageController.updateState();
    this.app.winnersController.updateState();
    this.app.root.append(this.app.mainContainer.view);
    this.app.mainContainer.switchPage(Pages.garage);
  }

  setMenuItemClick() {
    const garageItem = this.app.mainMenu.menuItems[Pages.garage];
    const winnersItem = this.app.mainMenu.menuItems[Pages.winners];
    garageItem.addEventListener('click', () =>
      this.app.mainContainer.switchPage(Pages.garage)
    );
    winnersItem.addEventListener('click', () =>
      this.app.mainContainer.switchPage(Pages.winners)
    );
  }
}
