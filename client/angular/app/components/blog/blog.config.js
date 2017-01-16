const config = ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('blog', {
      url: '/',
      template: '<blog></blog>'
    })
    .state('create-entry', {
      url: '/entry/create',
      template: '<create-entry></create-entry>'
    })
    .state('show-entry', {
      url: '/entry/:id',
      template: '<show-entry></show-entry>'
    });

  $urlRouterProvider.otherwise('/');
};

config.$inject = ['$stateProvider', '$urlRouterProvider'];

export default config;
