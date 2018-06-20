import * as React from 'react';
import {
  getWellnessLevelByScore,
  getAnxietyLevelByScore,
  getDepressionLevelByScore
} from '../../helpers/assessment';
import { calculateAverage } from '../../helpers/utils';

const getStatScore = ([timestamp, score]: number[]) => score;

interface ReportingAveragesProps {
  scorecardStats: number[][];
  assessmentStats: {
    [type: string]: number[][];
  };
}

const ReportingAverages = ({
  scorecardStats = [],
  assessmentStats
}: ReportingAveragesProps) => {
  const style = { fontSize: 24 };
  const { depression = [], anxiety = [], wellbeing = [] } = assessmentStats;
  const productivityScores = scorecardStats.map(getStatScore);
  const depressionScores = depression.map(getStatScore);
  const anxietyScores = anxiety.map(getStatScore);
  const wellBeingScores = wellbeing.map(getStatScore);
  const averageProductivity = calculateAverage(productivityScores);
  const averageDepression = calculateAverage(depressionScores);
  const averageAnxiety = calculateAverage(anxietyScores);
  // This is a bit of a hack, since wellness is calculated out of 80
  // total points, though anxiety and depression are out of 100
  const averageWellBeing = (calculateAverage(wellBeingScores) / 80) * 100;

  return (
    <div>
      <div className='text-blue' style={style}>
        {averageProductivity.toFixed(1)} points
      </div>
      <div className='reporting-label'>Average Productivity</div>

      <div className='text-blue' style={style}>
        {(averageWellBeing).toFixed(1)}% well-being
      </div>
      <div className='reporting-label'>
        Average - {getWellnessLevelByScore(averageWellBeing)}
      </div>

      <div className='text-blue' style={style}>
        {(averageAnxiety).toFixed(1)}% anxiety
      </div>
      <div className='reporting-label'>
        Average - {getAnxietyLevelByScore(averageAnxiety)}
      </div>

      <div className='text-blue' style={style}>
        {(averageDepression).toFixed(1)}% depression
      </div>
      <div className='reporting-label'>
        Average - {getDepressionLevelByScore(averageDepression)}
      </div>
    </div>
  );
};

export default ReportingAverages;
