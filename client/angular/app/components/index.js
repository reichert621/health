import angular from 'angular';
import Blog from './blog';
import Entry from './entry';

const components = angular
  .module('app.components', [
    Blog.name,
    Entry.name
  ]);

export default components;
