import * as React from 'react';
import { first, max, size, groupBy, keys } from 'lodash';
import { ReportingDatedItem } from '../../helpers/reporting';
import { DatedItem, getStreakStats } from '../../helpers/utils';

interface ReportingStreakProps {
  completedChecklists: ReportingDatedItem[];
  completedScorecards: ReportingDatedItem[];
}

// TODO: write unit tests for this
const getTotalStreak = (
  checklists: ReportingDatedItem[],
  scorecards: ReportingDatedItem[]
): number[] => {
  const all = checklists.concat(scorecards);
  const grouped = groupBy(all, 'date');
  const items = keys(grouped)
    .filter(date => grouped[date].length === 2)
    .map(date => ({ date }));

  return getStreakStats(items);
};

// TODO: unit tests
const calculateEarnings = (streaks: number[]): number => {
  const DAILY_EARNINGS = 10;
  const WEEKLY_EARNINGS = 30;
  const MONTHLY_EARNINGS = 200;
  const THREE_MONTH_BONUS = 400;
  const SIX_MONTH_BONUS = 800;
  const MAX_PER_YEAR = 100 * 100;

  return streaks.reduce((earnings, count) => {
    const n = count % 365;
    const days = n * DAILY_EARNINGS;
    const weeks = Math.floor(n / 7) * WEEKLY_EARNINGS;
    const months = Math.floor(n / 30) * MONTHLY_EARNINGS;
    const threeMonthBonus = n >= (3 * 30) ? THREE_MONTH_BONUS : 0;
    const sixMonthBonus = n >= (6 * 30) ? SIX_MONTH_BONUS : 0;
    const yearBonus = count >= 365 ? MAX_PER_YEAR : 0;
    const base = days + weeks + months;
    const bonuses = threeMonthBonus + sixMonthBonus + yearBonus;

    return earnings + base + bonuses;
  }, 0);
};

const ReportingStreaks = ({ completedChecklists, completedScorecards }: ReportingStreakProps) => {
  const checklistStreak = getStreakStats(completedChecklists);
  const scorecardStreak = getStreakStats(completedScorecards);
  const totalStreak = getTotalStreak(completedChecklists, completedScorecards);
  const earnings = calculateEarnings(totalStreak);
  const style = { fontSize: 16 };

  console.log('totals', totalStreak, earnings / 100);

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
