import angular from 'angular';
import component from './entry.component';

const entry = angular
  .module('entry', [])
  .component('entry', component);

export default entry;
