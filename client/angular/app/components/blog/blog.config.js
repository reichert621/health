const config = ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('blog', {
      url: '/',
      template: '<blog></blog>'
    });

  $urlRouterProvider.otherwise('/');
};

config.$inject = ['$stateProvider', '$urlRouterProvider'];

export default config;
