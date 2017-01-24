const config = ($stateProvider) => {
  $stateProvider
    .state('create-entry', {
      url: '/entry/create',
      template: '<create-entry></create-entry>'
    });
};

config.$inject = ['$stateProvider'];

export default config;
