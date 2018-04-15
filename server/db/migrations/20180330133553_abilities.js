exports.up = (knex) => {
  const abilities = [
    { id: 1, name: 'Health', description: 'Eating healthy, sleeping well, grooming, etc.' },
    { id: 2, name: 'Intelligence', description: 'Reading, lectures, podcasts, etc.' },
    { id: 3, name: 'Strength', description: 'Athletic ability, running, lifting, etc.' },
    { id: 4, name: 'Competence', description: 'Skill, performance, expertise, etc.' },
    { id: 5, name: 'Charisma', description: 'Character, relationships, confidence, etc.' },
    { id: 6, name: 'Mindfulness', description: 'Meditation, calmness, patience, etc.' }
  ];

  const categoryAbilities = {
    Read: 2,
    Write: 2,
    Learn: 2,
    Podcast: 2,
    Exercise: 3,
    Create: 4,
    Music: 4,
    Code: 4,
    Socialize: 5,
    Meditate: 6,
    'Eat Healthy': 1
  };

  return knex.schema
    .createTable('abilities', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('description');
    })
    .then(() => {
      const promises = abilities.map(ability => {
        return knex('abilities').insert(ability);
      });

      return Promise.all(promises);
    })
    .then(() => {
      return knex.schema.table('categories', table => {
        table.bigInteger('abilityId');
      });
    })
    .then(() => {
      const promises = Object.keys(categoryAbilities).map(name => {
        const abilityId = categoryAbilities[name];

        return knex('categories')
          .where({ name })
          .update({ abilityId });
      });

      return Promise.all(promises);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTable('abilities')
    .then(() => {
      return knex.schema.table('categories', table => {
        table.dropColumn('abilityId');
      });
    });
};
