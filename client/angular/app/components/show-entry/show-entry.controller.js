class ShowEntryController {
  constructor($log, $stateParams, EntryService) {
    this._log = $log;
    this.EntryService = EntryService;

    this.id = $stateParams.id;
    this.entry = {};
  }

  $onInit() {
    return this.fetch();
  }

  fetch() {
    const { EntryService, _log, id } = this;

    return EntryService.findById(id)
      .then(entry => {
        this.entry = entry;
      })
      .catch(_log.error);
  }

  remove(id) {
    const { EntryService, _log } = this;

    return EntryService.delete(id)
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
