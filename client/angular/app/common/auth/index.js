import angular from 'angular';
import factory from './auth.factory';

const auth = angular
  .module('auth', [])
  .factory('AuthService', factory);

export default auth;
