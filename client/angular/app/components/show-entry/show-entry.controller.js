class ShowEntryController {
  constructor($log, $stateParams, EntryService) {
    this._log = $log;
    this.Entry = EntryService;

    this.id = $stateParams.id;
    this.entry = {};
  }

  $onInit() {
    return this.fetch();
  }

  fetch() {
    const { Entry, _log, id } = this;

    return Entry.findById(id)
      .then(entry => {
        this.entry = entry;
      })
      .catch(_log.error);
  }

  remove(id) {
    const { Entry, _log } = this;

    return Entry.delete(id)
      .then(_log.info)
      .catch(_log.error);
  }
}

ShowEntryController.$inject = [
  '$log',
  '$stateParams',
  'EntryService'
];

export default ShowEntryController;
