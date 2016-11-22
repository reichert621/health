const config = ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('blog', {
      url: '/blog',
      template: '<blog></blog>'
    });

  $urlRouterProvider.otherwise('/blog');
};

config.$inject = ['$stateProvider', '$urlRouterProvider'];

export default config;
