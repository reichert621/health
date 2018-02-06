import React from 'react';
import { DAYS_OF_WEEK, calculateAverage } from '../../helpers/utils';

const ScoresByDay = ({ checklistScores, scorecardScores }) => {
  return (
    <div className="">
      {
        DAYS_OF_WEEK.map((day, key) => {
          const checklistScore = checklistScores[day];
          const scorecardScore = scorecardScores[day];
          const checklistAverage = calculateAverage(checklistScore).toFixed(1);
          const scorecardAverage = calculateAverage(scorecardScore).toFixed(1);
          const happinessPercentage = 100 - checklistAverage;

          return (
            <div key={key}>
              <div className="text-active">
                {day}
              </div>

              <div style={{ marginBottom: 16, marginTop: 4 }}>
                {happinessPercentage}% happy / {scorecardAverage} tasks
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByDay;
