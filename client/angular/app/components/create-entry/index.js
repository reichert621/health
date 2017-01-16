import angular from 'angular';
import uiRouter from 'angular-ui-router';
// import config from './create-entry.config';
import component from './create-entry.component';

const createEntry = angular
  .module('createEntry', [
    uiRouter
  ])
  // .config(config)
  .component('createEntry', component);

export default createEntry;
