import React from 'react';
import { first, max, size } from 'lodash';
import { getStreakStats } from '../../helpers/utils';

const ReportingStreaks = ({ completedChecklists, completedScorecards }) => {
  const checklistStreak = getStreakStats(completedChecklists);
  const scorecardStreak = getStreakStats(completedScorecards);

  return (
    <div>
      <div className="reporting-component-container">
        <div className="text-active">{first(scorecardStreak)} days</div>
        <div className="reporting-label">Latest Productivity Streak</div>

        <div className="text-active">{first(checklistStreak)} days</div>
        <div className="reporting-label">Latest Check-in Streak</div>

        <div className="text-active">{max(scorecardStreak)} days</div>
        <div className="reporting-label">Longest Productivity Streak</div>

        <div className="text-active">{max(checklistStreak)} days</div>
        <div className="reporting-label">Longest Check-in Streak</div>

        {/* <div className="text-active">{size(completedScorecards)} days</div>
        <div className="reporting-label">Productive Days</div>

        <div className="text-active">{size(completedChecklists)} days</div>
        <div className="reporting-label">Total Check-ins</div> */}
      </div>
    </div>
  );
};

export default ReportingStreaks;
