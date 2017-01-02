module.exports = {
  dev: {
    client: 'postgresql',
    connection: {
      database: 'demo',
      user: '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds'
    }
  }
};
