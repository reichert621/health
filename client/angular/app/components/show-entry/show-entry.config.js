const config = ($stateProvider) => {
  $stateProvider
    .state('show-entry', {
      url: '/entry/:id',
      template: '<show-entry></show-entry>'
    });
};

config.$inject = ['$stateProvider'];

export default config;
