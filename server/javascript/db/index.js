const Users = require('./controllers/users');
const Entries = require('./controllers/entries');
const ScoreCard = require('./models/scorecard');
const Task = require('./models/task');
const Checklist = require('./models/checklist');
const ChecklistScore = require('./models/checklist_score'); // TODO: undo snakecase?
const ChecklistQuestion = require('./models/checklist_question'); // TODO: undo snakecase?

module.exports = {
  Users,
  Entries,
  ScoreCard,
  Task,
  Checklist,
  ChecklistScore,
  ChecklistQuestion
};
