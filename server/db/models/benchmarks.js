const assert = require('assert');
const {
  ScoreCard,
  Checklist,
  Task,
  Assessment
} = require('../index');

const { DEPRESSION, ANXIETY, WELL_BEING } = Assessment.AssessmentTypes;
const USER_ID = process.env.USER_ID || 1; // me
const dates = {
  startDate: -Infinity,
  endDate: Infinity
};

describe('Checklists', () => {
  it('fetchStats', () => {
    console.time('Checklist.fetchStats');
    return Checklist.fetchStats(USER_ID, dates)
      .then(result => {
        console.timeEnd('Checklist.fetchStats');
      })
      .catch(err => console.log('Error [Checklist.fetchStats]:', err));
  });
});

describe('Scorecards', () => {
  it('fetchStats', () => {
    console.time('ScoreCard.fetchStats');
    return ScoreCard.fetchStats(USER_ID, dates)
      .then(result => {
        console.timeEnd('ScoreCard.fetchStats');
      })
      .catch(err => console.log('Error [ScoreCard.fetchStats]:', err));
  });
  it('fetchCompletedDays', () => {
    console.time('ScoreCard.fetchCompletedDays');
    return ScoreCard.fetchCompletedDays(USER_ID, dates)
      .then(result => {
        console.timeEnd('ScoreCard.fetchCompletedDays');
      })
      .catch(err => console.log('Error [ScoreCard.fetchCompletedDays]:', err));
  });
  it('fetchScoresByDayOfWeek', () => {
    console.time('ScoreCard.fetchScoresByDayOfWeek');
    return ScoreCard.fetchScoresByDayOfWeek(USER_ID, dates)
      .then(result => {
        console.timeEnd('ScoreCard.fetchScoresByDayOfWeek');
      })
      .catch(err => console.log('Error [ScoreCard.fetchScoresByDayOfWeek]:', err));
  });
  it('fetchTotalScoreOverTime', () => {
    console.time('ScoreCard.fetchTotalScoreOverTime');
    return ScoreCard.fetchTotalScoreOverTime(USER_ID, dates)
      .then(result => {
        console.timeEnd('ScoreCard.fetchTotalScoreOverTime');
      })
      .catch(err => console.log('Error [ScoreCard.fetchTotalScoreOverTime]:', err));
  });
  it('fetchAbilityStats', () => {
    console.time('ScoreCard.fetchAbilityStats');
    return ScoreCard.fetchAbilityStats(USER_ID, dates)
      .then(result => {
        console.timeEnd('ScoreCard.fetchAbilityStats');
      })
      .catch(err => console.log('Error [ScoreCard.fetchAbilityStats]:', err));
  });
});

describe('Tasks', () => {
  it('fetchTopSelected', () => {
    console.time('Task.fetchTopSelected');
    return Task.fetchTopSelected(USER_ID, dates)
      .then(result => {
        console.timeEnd('Task.fetchTopSelected');
      })
      .catch(err => console.log('Error [Task.fetchTopSelected]:', err));
  });
});

describe('Assessments', () => {
  it('fetchStats', () => {
    console.time('Assessment.fetchStats');
    return Assessment.fetchStats(USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchStats');
      })
      .catch(err => console.log('Error [Assessment.fetchStats]:', err));
  });
});

describe('Assessments - Depression', () => {
  it('fetchCompletedDaysByType', () => {
    console.time('Assessment.fetchCompletedDaysByType');
    return Assessment.fetchCompletedDaysByType(DEPRESSION, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchCompletedDaysByType');
      })
      .catch(err => console.log('Error [Assessment.fetchCompletedDaysByType]:', err));
  });
  it('fetchScoresByDayOfWeek', () => {
    console.time('Assessment.fetchScoresByDayOfWeek');
    return Assessment.fetchScoresByDayOfWeek(DEPRESSION, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoresByDayOfWeek');
      })
      .catch(err => console.log('Error [Assessment.fetchScoresByDayOfWeek]:', err));
  });
  it('fetchScoreRangeFrequency', () => {
    console.time('Assessment.fetchScoreRangeFrequency');
    return Assessment.fetchScoreRangeFrequency(DEPRESSION, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoreRangeFrequency');
      })
      .catch(err => console.log('Error [Assessment.fetchScoreRangeFrequency]:', err));
  });
  it('fetchQuestionStats', () => {
    console.time('Assessment.fetchQuestionStats');
    return Assessment.fetchQuestionStats(DEPRESSION, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchQuestionStats');
      })
      .catch(err => console.log('Error [Assessment.fetchQuestionStats]:', err));
  });
  it('fetchScoresByTask', () => {
    console.time('Assessment.fetchScoresByTask');
    return Assessment.fetchScoresByTask(DEPRESSION, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoresByTask');
      })
      .catch(err => console.log('Error [Assessment.fetchScoresByTask]:', err));
  });
});

describe('Assessments - Anxiety', () => {
  it('fetchCompletedDaysByType', () => {
    console.time('Assessment.fetchCompletedDaysByType');
    return Assessment.fetchCompletedDaysByType(ANXIETY, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchCompletedDaysByType');
      })
      .catch(err => console.log('Error [Assessment.fetchCompletedDaysByType]:', err));
  });
  it('fetchScoresByDayOfWeek', () => {
    console.time('Assessment.fetchScoresByDayOfWeek');
    return Assessment.fetchScoresByDayOfWeek(ANXIETY, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoresByDayOfWeek');
      })
      .catch(err => console.log('Error [Assessment.fetchScoresByDayOfWeek]:', err));
  });
  it('fetchScoreRangeFrequency', () => {
    console.time('Assessment.fetchScoreRangeFrequency');
    return Assessment.fetchScoreRangeFrequency(ANXIETY, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoreRangeFrequency');
      })
      .catch(err => console.log('Error [Assessment.fetchScoreRangeFrequency]:', err));
  });
  it('fetchQuestionStats', () => {
    console.time('Assessment.fetchQuestionStats');
    return Assessment.fetchQuestionStats(ANXIETY, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchQuestionStats');
      })
      .catch(err => console.log('Error [Assessment.fetchQuestionStats]:', err));
  });
  it('fetchScoresByTask', () => {
    console.time('Assessment.fetchScoresByTask');
    return Assessment.fetchScoresByTask(ANXIETY, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoresByTask');
      })
      .catch(err => console.log('Error [Assessment.fetchScoresByTask]:', err));
  });
});

describe('Assessments - Wellness', () => {
  it('fetchCompletedDaysByType', () => {
    console.time('Assessment.fetchCompletedDaysByType');
    return Assessment.fetchCompletedDaysByType(WELL_BEING, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchCompletedDaysByType');
      })
      .catch(err => console.log('Error [Assessment.fetchCompletedDaysByType]:', err));
  });
  it('fetchScoresByDayOfWeek', () => {
    console.time('Assessment.fetchScoresByDayOfWeek');
    return Assessment.fetchScoresByDayOfWeek(WELL_BEING, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoresByDayOfWeek');
      })
      .catch(err => console.log('Error [Assessment.fetchScoresByDayOfWeek]:', err));
  });
  it('fetchScoreRangeFrequency', () => {
    console.time('Assessment.fetchScoreRangeFrequency');
    return Assessment.fetchScoreRangeFrequency(WELL_BEING, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoreRangeFrequency');
      })
      .catch(err => console.log('Error [Assessment.fetchScoreRangeFrequency]:', err));
  });
  it('fetchQuestionStats', () => {
    console.time('Assessment.fetchQuestionStats');
    return Assessment.fetchQuestionStats(WELL_BEING, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchQuestionStats');
      })
      .catch(err => console.log('Error [Assessment.fetchQuestionStats]:', err));
  });
  it('fetchScoresByTask', () => {
    console.time('Assessment.fetchScoresByTask');
    return Assessment.fetchScoresByTask(WELL_BEING, USER_ID, dates)
      .then(result => {
        console.timeEnd('Assessment.fetchScoresByTask');
      })
      .catch(err => console.log('Error [Assessment.fetchScoresByTask]:', err));
  });
});
