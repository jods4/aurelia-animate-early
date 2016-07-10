import { autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject
export class App {
  delay = 1000;
  spinnerDelay = window['earlyAnimation'] ? '0.5s' : '0';

  constructor(public router: Router) {
  }

  configureRouter(config: RouterConfiguration, router: Router) {    
    config.map([
      { route: ['', 'A'],  moduleId: './pages/A' },
      { route: 'B',        moduleId: './pages/B' },
    ]);
  }  
}