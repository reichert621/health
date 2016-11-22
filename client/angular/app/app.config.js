const config = ($locationProvider) => {
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  // $locationProvider.html5Mode(true).hashPrefix('!');
};

config.$inject = ['$locationProvider'];

export default config;
