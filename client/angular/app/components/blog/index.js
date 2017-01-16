import angular from 'angular';
import uiRouter from 'angular-ui-router';
import config from './blog.config';
import component from './blog.component';
import './blog.css';

const blog = angular
  .module('blog', [
    uiRouter
  ])
  .config(config)
  .component('blog', component);

export default blog;
