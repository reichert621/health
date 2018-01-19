import React from 'react';
import { DAYS_OF_WEEK, calculateAverage } from '../../helpers/utils';

const ScoresByDay = ({ checklistScores, scorecardScores }) => {
  return (
    <div className="reporting-component-container">
      {
        DAYS_OF_WEEK.map((day, key) => {
          const checklistScore = checklistScores[day];
          const scorecardScore = scorecardScores[day];
          const checklistAverage = calculateAverage(checklistScore).toFixed(1);
          const scorecardAverage = calculateAverage(scorecardScore).toFixed(1);

          return (
            <div key={key} style={{ marginBottom: 4 }}>
              <span className="text-active">{day}</span>
              <span> - {checklistAverage} mood / {scorecardAverage} tasks</span>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByDay;
