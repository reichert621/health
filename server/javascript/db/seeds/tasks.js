exports.seed = (knex, Promise) => {
  const tasks = [
    // Read
    { id: 1, categoryId: 1, description: '2+ hours', points: 8 },
    { id: 2, categoryId: 1, description: '1 hour', points: 4 },
    { id: 3, categoryId: 1, description: '40 mins', points: 2 },
    { id: 4, categoryId: 1, description: '< 20 mins', points: 1 },
    // Write
    { id: 5, categoryId: 2, description: 'Blog Entry', points: 8 },
    { id: 6, categoryId: 2, description: 'Journaling', points: 4 },
    // Exercise
    { id: 7, categoryId: 3, description: 'Gym workout', points: 8 },
    { id: 8, categoryId: 3, description: 'Basketball', points: 8 },
    { id: 9, categoryId: 3, description: 'Yoga', points: 4 },
    { id: 10, categoryId: 3, description: 'Bike', points: 2 },
    { id: 11, categoryId: 3, description: 'Walk', points: 1 },
    { id: 12, categoryId: 3, description: 'Home workout', points: 1 },
    // Eat Healthy
    { id: 13, categoryId: 4, description: 'Salad', points: 4 },
    { id: 14, categoryId: 4, description: 'Veggie smoothie', points: 4 },
    { id: 15, categoryId: 4, description: 'Eggs', points: 4 },
    { id: 16, categoryId: 4, description: '8 glasses of water', points: 4 },
    { id: 17, categoryId: 4, description: 'Fruit smoothie', points: 2 },
    // Code
    { id: 18, categoryId: 5, description: 'Side project', points: 8 },
    { id: 19, categoryId: 5, description: 'Practice problems', points: 4 },
    // Music
    { id: 20, categoryId: 6, description: 'Cello', points: 8 },
    { id: 21, categoryId: 6, description: 'Guitar', points: 2 },
    { id: 22, categoryId: 6, description: 'Piano', points: 1 },
    // Podcast
    { id: 23, categoryId: 7, description: '2+ hours', points: 4 },
    { id: 24, categoryId: 7, description: '1 hour', points: 2 },
    { id: 25, categoryId: 7, description: '< 1 hour', points: 1 },
    // Socialize
    { id: 26, categoryId: 8, description: 'Organize a dinner/party/event', points: 8 },
    { id: 27, categoryId: 8, description: 'Get lunch/dinner with friends', points: 4 },
    { id: 28, categoryId: 8, description: 'Message family to check in', points: 4 },
    { id: 29, categoryId: 8, description: 'Message a friend to check in', points: 2 },
    // Meditate
    { id: 30, categoryId: 9, description: '10+ minutes', points: 4 },
    { id: 31, categoryId: 9, description: '1 - 10 minutes', points: 2 },
    { id: 32, categoryId: 9, description: '< 1 minute', points: 1 }
  ];

  const insert = (tasks) =>
    Promise.all(
      tasks.map(task => knex('tasks').insert(task))
    );

  return knex('tasks').del()
    .then(() => insert(tasks));
};
