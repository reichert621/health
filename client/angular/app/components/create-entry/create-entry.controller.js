class CreateEntryController {
  constructor($log, $state, EntryService) {
    this.log = $log;
    this.go = $state.go;
    this.Entry = EntryService;
    this.entry = {};
  }

  $onInit() {}

  add(entry) {
    const { Entry, go, log } = this;
    const next = 'show-entry';

    return Entry.create(entry)
      .then(ent => go(next, { id: ent.id }))
      .catch(log.error);
  }
}

CreateEntryController.$inject = ['$log', '$state', 'EntryService'];

export default CreateEntryController;
