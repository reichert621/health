import angular from 'angular';
import uiRouter from 'angular-ui-router';
// import config from './show-entry.config';
import component from './show-entry.component';

const showEntry = angular
  .module('showEntry', [
    uiRouter
  ])
  // .config(config)
  .component('showEntry', component);

export default showEntry;
