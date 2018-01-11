const users = require('./users');
const entries = require('./entries');
const scorecards = require('./scorecards');
const categories = require('./categories');
const tasks = require('./tasks');
const checklists = require('./checklists');
const checklistScores = require('./checklist_scores'); // TODO: undo snakecase?
const checklistQuestions = require('./checklist_questions'); // TODO: undo snakecase?

module.exports = {
  users,
  entries,
  scorecards,
  categories,
  tasks,
  checklists,
  checklistScores,
  checklistQuestions
};
