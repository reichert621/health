function EntryService($http) {
  return {
    list() {
      return $http.get('/api/entries')
        .then(res => {
          const { entries = [] } = res.data;

          return entries;
        });
    },

    create() {
      return console.log('Create entry!');
    }
  };
};

EntryService.$inject = ['$http'];

export default EntryService;
