import { Pages } from '../models/enums';
import { Application } from '../models/models';
import sayToast from '../utils/say-toast';
import MainContainer from '../views/main-container/main-container';
import NavMenu from '../views/main-container/nav-menu';
import toastElement from '../views/main-container/toast';
import AppController from './app-controller';
import GarageController from './garage-controller';
import WinnersController from './winners-controller';

export default class App implements Application {
  root = document.body;

  mainMenu: NavMenu;

  mainContainer: MainContainer;

  garageController: GarageController;

  winnersController: WinnersController;

  constructor() {
    this.winnersController = new WinnersController();
    this.garageController = new GarageController(this.winnersController);
    const pages = [];
    pages[Pages.garage] = this.garageController.garageView.view;
    pages[Pages.winners] = this.winnersController.view;
    this.mainMenu = new NavMenu([
      {
        pageIndex: Pages.garage,
        pageName: 'To Garage',
      },
      {
        pageIndex: Pages.winners,
        pageName: 'To Winners',
      },
    ]);
    this.mainContainer = new MainContainer(this.mainMenu, ...pages);
  }

  start() {
    const appActions = new AppController(this);
    appActions.start();
    global.sayToast = sayToast(toastElement);
  }
}
