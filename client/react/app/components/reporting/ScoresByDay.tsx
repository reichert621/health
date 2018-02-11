import * as React from 'react';
import { ScoreByDay } from '../../helpers/reporting';
import { DAYS_OF_WEEK, calculateAverage } from '../../helpers/utils';

interface ScoresByDayProps {
  checklistScores: ScoreByDay;
  scorecardScores: ScoreByDay;
}

const ScoresByDay = ({ checklistScores, scorecardScores }: ScoresByDayProps) => {
  return (
    <div>
      {
        DAYS_OF_WEEK.map((day, key) => {
          const checklistScore = checklistScores[day];
          const scorecardScore = scorecardScores[day];
          const checklistAverage = calculateAverage(checklistScore);
          const scorecardAverage = calculateAverage(scorecardScore);
          const happinessPercentage = 100 - checklistAverage;

          return (
            <div key={key}>
              <div className='text-active'>
                {day}
              </div>

              <div style={{ marginBottom: 16, marginTop: 4 }}>
                {happinessPercentage.toFixed(1)}% happy / {scorecardAverage.toFixed(1)} tasks
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByDay;
