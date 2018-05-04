import * as React from 'react';
import { max, min } from 'lodash';
import { calculateAverage } from '../../helpers/utils';

const getStatScore = ([timestamp, score]: number[]) => score;

interface ReportingAveragesProps {
  checklistStats: number[][];
  scorecardStats: number[][];
}

const ReportingAverages = ({
  checklistStats = [],
  scorecardStats = []
}: ReportingAveragesProps) => {
  const style = { fontSize: 24 };
  const productivityScores = scorecardStats.map(getStatScore);
  const moodScores = checklistStats.map(getStatScore);
  const averageProductivity = calculateAverage(productivityScores);
  const averageMood = calculateAverage(moodScores);
  const topProductivity = max(productivityScores);
  const topMood = min(moodScores);

  return (
    <div>
      <div className='text-blue' style={style}>
        {averageProductivity.toFixed(1)} points
      </div>
      <div className='reporting-label'>Average Productivity</div>

      <div className='text-blue' style={style}>
        {(100 - averageMood).toFixed(1)}% happy
      </div>
      <div className='reporting-label'>Average Mood</div>

      <div className='text-blue' style={style}>
        {topProductivity} points
      </div>
      <div className='reporting-label'>Top Productivity</div>

      <div className='text-blue' style={style}>
        {(100 - topMood)}% happy
      </div>
      <div className='reporting-label'>Top Mood</div>
    </div>
  );
};

export default ReportingAverages;
