import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common';
import Components from './components';
import config from './app.config';
import component from './app.component';
import 'normalize.css';
import './app.css';

const app = angular
  .module('app', [
    uiRouter,
    Common.name,
    Components.name
  ])
  .config(config)
  .component('app', component);

export default app;
