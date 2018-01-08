const { groupBy } = require('lodash');
// TODO: move to db
const tasks = [
  // Read
  { category: 'Read', description: '2+ hours', points: 8 },
  { category: 'Read', description: '1 hour', points: 4 },
  { category: 'Read', description: '40 mins', points: 2 },
  { category: 'Read', description: '< 20 mins', points: 1 },
  // Write
  { category: 'Write', description: 'Blog entry', points: 8 },
  { category: 'Write', description: 'Journal entry', points: 4 },
  // Exercise
  { category: 'Exercise', description: 'Go to the gym', points: 8 },
  { category: 'Exercise', description: 'Play a sport', points: 8 },
  { category: 'Exercise', description: 'Do yoga', points: 4 },
  { category: 'Exercise', description: 'Bike', points: 2 },
  { category: 'Exercise', description: 'Go for a walk', points: 1 },
  { category: 'Exercise', description: 'Workout at home', points: 1 },
  // Eat Healthy
  { category: 'Eat Healthy', description: 'Vegetables', points: 8 },
  { category: 'Eat Healthy', description: 'Fruits', points: 4 },
  { category: 'Eat Healthy', description: '8 glasses of water', points: 4 },
  // Socialize
  { category: 'Socialize', description: 'Organize a social event', points: 8 },
  { category: 'Socialize', description: 'Get a meal with friends or family', points: 4 },
  { category: 'Socialize', description: 'Contact a family member', points: 2 },
  { category: 'Socialize', description: 'Contact a friend', points: 2 },
  // Meditate
  { category: 'Meditate', description: '10+ minutes', points: 4 },
  { category: 'Meditate', description: '1 - 10 minutes', points: 2 },
  { category: 'Meditate', description: '< 1 minute', points: 1 }
];

const getDefaults = () => {
  return groupBy(tasks, 'category');
};

module.exports = {
  getDefaults
};
