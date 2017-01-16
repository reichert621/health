import angular from 'angular';
import Blog from './blog';
import Entry from './entry';
import CreateEntry from './create-entry';
import ShowEntry from './show-entry';

const components = angular
  .module('app.components', [
    Blog.name,
    Entry.name,
    CreateEntry.name,
    ShowEntry.name
  ]);

export default components;
