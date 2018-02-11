import * as React from 'react';
import { first, max, size } from 'lodash';
import { ReportingDatedItem } from '../../helpers/reporting';
import { getStreakStats } from '../../helpers/utils';

interface ReportingStreakProps {
  completedChecklists: ReportingDatedItem[];
  completedScorecards: ReportingDatedItem[];
}

const ReportingStreaks = ({ completedChecklists, completedScorecards }: ReportingStreakProps) => {
  const checklistStreak = getStreakStats(completedChecklists);
  const scorecardStreak = getStreakStats(completedScorecards);
  const style = { fontSize: 16 };

  return (
    <div>
      <div className='text-active' style={style}>{first(scorecardStreak)} days</div>
      <div className='reporting-label'>Latest Productivity Streak</div>

      <div className='text-active' style={style}>{first(checklistStreak)} days</div>
      <div className='reporting-label'>Latest Check-in Streak</div>

      <div className='text-active' style={style}>{max(scorecardStreak)} days</div>
      <div className='reporting-label'>Longest Productivity Streak</div>

      <div className='text-active' style={style}>{max(checklistStreak)} days</div>
      <div className='reporting-label'>Longest Check-in Streak</div>

      <div className='text-active' style={style}>{size(completedScorecards)} days</div>
      <div className='reporting-label'>Non-Zero Days</div>

      {/* <div className='text-active' style={style}>{size(completedChecklists)} days</div>
      <div className='reporting-label'>Total Check-ins</div> */}
    </div>
  );
};

export default ReportingStreaks;
