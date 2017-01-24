import angular from 'angular';
import uiRouter from 'angular-ui-router';
import config from './login.config';
import component from './login.component';

const login = angular
  .module('login', [
    uiRouter
  ])
  .config(config)
  .component('login', component);

export default login;
