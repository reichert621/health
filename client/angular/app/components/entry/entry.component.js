import template from './entry.html';

const component = {
  template,
  restrict: 'E',
  bindings: {
    entry: '=',
    onRemove: '&'
  }
};

export default component;
