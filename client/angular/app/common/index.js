import angular from 'angular';
import Auth from './auth';

const common = angular
  .module('app.common', [
    Auth.name
  ]);

export default common;
