import { autoinject } from 'aurelia-framework';
import { App } from '../app';

@autoinject
export class PageB {
  constructor(private app: App) {    
  }

  activate() {
    return new Promise(resolve => setTimeout(resolve, this.app.delay));
  }
}