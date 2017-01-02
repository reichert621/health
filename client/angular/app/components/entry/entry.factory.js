function EntryService($http) {
  return {
    list: () =>
      $http.get('/api/entries')
        .then(res => res.data.entries),

    findById: (id) =>
      $http.get(`/api/entries/${id}`)
        .then(res => res.data.entry),

    create: (params) =>
      $http.post('/api/entries', params)
        .then(res => res.data.entry),

    delete: (id) =>
      $http.delete(`/api/entries/${id}`)
        .then(res => res.data.entry)
  };
};

EntryService.$inject = ['$http'];

export default EntryService;
