import angular from 'angular';
import component from './entry.component';
import factory from './entry.factory';
import './entry.css';

const entry = angular
  .module('entry', [])
  .component('entry', component)
  .factory('EntryService', factory);

export default entry;
