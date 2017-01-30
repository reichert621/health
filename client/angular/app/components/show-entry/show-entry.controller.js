class ShowEntryController {
  constructor($log, $state, $stateParams, EntryService) {
    this.log = $log;
    this.go = $state.go;
    this.Entry = EntryService;

    this.id = $stateParams.id;
    this.entry = {};
  }

  $onInit() {
    return this.fetch();
  }

  fetch() {
    const { Entry, log, id } = this;

    return Entry.findById(id)
      .then(entry => {
        this.entry = entry;
      })
      .catch(log.error);
  }

  remove() {
    const { Entry, log, go, id } = this;

    return Entry.delete(id)
      .then(() => go('blog'))
      .catch(log.error);
  }
}

ShowEntryController.$inject = [
  '$log',
  '$state',
  '$stateParams',
  'EntryService'
];

export default ShowEntryController;
