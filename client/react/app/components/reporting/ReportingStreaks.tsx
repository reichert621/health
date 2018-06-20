import * as React from 'react';
import { first, max, size, groupBy, keys } from 'lodash';
import { ReportingDatedItem } from '../../helpers/reporting';
import { DatedItem, getStreakStats } from '../../helpers/utils';

interface ReportingStreakProps {
  completedScorecards: ReportingDatedItem[];
  completedDepressionAssessments: ReportingDatedItem[];
  completedAnxietyAssessments: ReportingDatedItem[];
  completedWellnessAssessments: ReportingDatedItem[];
  completedChecklists?: ReportingDatedItem[];
}

const ReportingStreaks = ({
  completedScorecards = [],
  completedDepressionAssessments = [],
  completedAnxietyAssessments = [],
  completedWellnessAssessments = [],
  completedChecklists = []
}: ReportingStreakProps) => {
  const scorecardStreak = getStreakStats(completedScorecards);
  const depressionCheckinStreak = getStreakStats(completedDepressionAssessments);
  const anxietyCheckinStreak = getStreakStats(completedAnxietyAssessments);
  const wellnessCheckinStreak = getStreakStats(completedWellnessAssessments);
  const style = { fontSize: 16 };

  return (
    <div>
      <div className='text-active' style={style}>
        {first(scorecardStreak) || 0} days
      </div>
      <div className='reporting-label'>Latest Productivity Streak</div>

      <div className='text-active' style={style}>
        {first(wellnessCheckinStreak) || 0} days
      </div>
      <div className='reporting-label'>Latest Wellness Check-in Streak</div>

      <div className='text-active' style={style}>
        {first(anxietyCheckinStreak) || 0} days
      </div>
      <div className='reporting-label'>Latest Anxiety Check-in Streak</div>

      <div className='text-active' style={style}>
        {first(depressionCheckinStreak) || 0} days
      </div>
      <div className='reporting-label'>Latest Depression Check-in Streak</div>

      {/* <div className='text-active' style={style}>{max(scorecardStreak) || 0} days</div>
      <div className='reporting-label'>Longest Productivity Streak</div>

      <div className='text-active' style={style}>{max(checklistStreak) || 0} days</div>
      <div className='reporting-label'>Longest Check-in Streak</div> */}

      <div className='text-active' style={style}>{size(completedScorecards) || 0} days</div>
      <div className='reporting-label'>Non-Zero Days</div>

      {/* <div className='text-active' style={style}>{size(completedChecklists)} days</div>
      <div className='reporting-label'>Total Check-ins</div> */}
    </div>
  );
};

export default ReportingStreaks;
