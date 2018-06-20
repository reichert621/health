import * as React from 'react';
import { ScoreByDay } from '../../helpers/reporting';
import { DAYS_OF_WEEK, calculateAverage } from '../../helpers/utils';

// Averages inverse of depression/anxiety with wellness
const calculateHappiness = (
  depression: number,
  anxiety: number,
  wellness: number
) => {
  const scores = [
    100 - depression,
    100 - anxiety,
    wellness
  ];

  return calculateAverage(scores);
};

interface ScoresByDayProps {
  scorecardScores: ScoreByDay;
  depressionScores: ScoreByDay;
  anxietyScores: ScoreByDay;
  wellnessScores: ScoreByDay;
}

const ScoresByDay = ({
  scorecardScores,
  depressionScores,
  anxietyScores,
  wellnessScores
}: ScoresByDayProps) => {
  return (
    <div>
      {
        DAYS_OF_WEEK.map((day, key) => {
          const scorecardScore = scorecardScores[day];
          const depressionScore = depressionScores[day];
          const anxietyScore = anxietyScores[day];
          const wellnessScore = wellnessScores[day];
          const scorecardAverage = calculateAverage(scorecardScore);
          const depressionAverage = calculateAverage(depressionScore);
          const anxietyAverage = calculateAverage(anxietyScore);
          // This is a bit of a hack, since wellness is calculated out of 80
          // total points, though anxiety and depression are out of 100
          const wellnessAverage = (calculateAverage(wellnessScore) / 80) * 100;
          const happiness = calculateHappiness(
            depressionAverage,
            anxietyAverage,
            wellnessAverage
          );

          return (
            <div key={key}>
              <div className='text-active'>
                {day}
              </div>

              <div style={{ marginBottom: 16, marginTop: 4 }}>
                {happiness.toFixed(1)}% happy / {scorecardAverage.toFixed(1)} tasks
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByDay;
