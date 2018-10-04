const knex = require('./knex');

const times = {};

module.exports = knex
  .on('query', (query) => {
    const { __knexQueryUid: uid, sql, bindings } = query;

    Object.assign(times, {
      [uid]: {
        sql,
        bindings,
        startTime: +(new Date())
      }
    });
  })
  .on('query-response', (res, query) => {
    const endTime = +(new Date());
    const { __knexQueryUid: uid } = query;
    const { sql, bindings, startTime } = times[uid];
    const diff = endTime - startTime;

    console.log('\nSQL:', sql, bindings);
    console.log(`Time elapsed: ${diff}ms`);
    console.log(times);

    delete times[uid];
  });
