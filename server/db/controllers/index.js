const users = require('./users');
const entries = require('./entries');
const scorecards = require('./scorecards');
const categories = require('./categories');
const tasks = require('./tasks');
const checklists = require('./checklists');
const checklistScores = require('./checklist_scores'); // TODO: undo snakecase?
const checklistQuestions = require('./checklist_questions'); // TODO: undo snakecase?
const imperatives = require('./imperatives');
const gratitudes = require('./gratitudes');
const reporting = require('./reporting');
const challenges = require('./challenges');
const moods = require('./moods');
const assessments = require('./assessments');
const assessmentQuestions = require('./assessment_questions');

module.exports = {
  users,
  entries,
  scorecards,
  categories,
  tasks,
  checklists,
  checklistScores,
  checklistQuestions,
  imperatives,
  gratitudes,
  reporting,
  challenges,
  moods,
  assessments,
  assessmentQuestions
};
