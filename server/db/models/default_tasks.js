const { groupBy } = require('lodash');
// TODO: move to db
const tasks = [
  // Read
  { category: 'Read', description: 'For 20 minutes', points: 1 },
  // Write
  { category: 'Write', description: 'Do some journaling', points: 4 },
  // Exercise
  { category: 'Exercise', description: 'Go for a walk', points: 2 },
  { category: 'Exercise', description: 'Do 20 pushups', points: 1 },
  // Eat Healthy
  { category: 'Eat Healthy', description: 'Eat a salad', points: 4 },
  // Socialize
  { category: 'Socialize', description: 'Hang out with friends', points: 4 },
  // Meditate
  { category: 'Meditate', description: 'For 5 minutes', points: 2 },
  // Get Organized
  { category: 'Get Organized', description: 'Plan out the day', points: 1 }
];

const getDefaults = () => tasks;

module.exports = {
  getDefaults
};
