import * as React from 'react';
import { isNumber } from 'lodash';

enum StatType { POSITIVE, NEGATIVE }

enum DeltaColor {
  BLUE = '#33A2CC',
  RED = '#da2a54'
}

const getDeltaColor = (delta: number, statType: StatType) => {
  if (!delta) return null; // color should not change

  switch (statType) {
    case StatType.POSITIVE:
      return delta > 0 ? DeltaColor.BLUE : DeltaColor.RED;
    case StatType.NEGATIVE:
      return delta < 0 ? DeltaColor.BLUE : DeltaColor.RED;
    default:
      return null;
  }
};

interface StatProps {
  today: number;
  thisWeek: number;
  lastWeek: number;
}

interface StatSectionProps {
  title: string;
  statType: StatType;
  formatter: (val: number) => string;
  stats: StatProps;
}

const ThisWeekStatsSection = ({
  title,
  statType,
  formatter = (v) => v,
  stats = {} as StatProps
}: StatSectionProps) => {
  const { today, thisWeek, lastWeek } = stats;
  const delta = (isNumber(lastWeek) && isNumber(thisWeek))
    ? thisWeek - lastWeek
    : null;

  const color = getDeltaColor(delta, statType);
  const prefix = (isNumber(delta) && delta > 0) ? 'up' : 'down';
  const abs = isNumber(delta) ? Math.abs(delta) : null;

  return (
    <div className='weekly-stat-container clearfix text-center'>
      <div className='weekly-stat-section-label text-active'>{title}</div>
      <div className='weekly-stat-main-container'>
        <div className='weekly-stat-main-value'>
          {formatter(today)}
        </div>
        <div className='weekly-stat-main-label'>Today</div>
      </div>

      <div className='weekly-stat-sub-container'>
        <div className='weekly-stat-sub-value'>
          {formatter(thisWeek)}
        </div>
        <div className='weekly-stat-sub-label'>average this week</div>
      </div>
      <div className='weekly-stat-sub-container'>
        <div
          className='weekly-stat-sub-value'
          style={{ color: color ? color : 'inherit' }}>
          {isNumber(delta) ? prefix : ''} {formatter(abs)}
        </div>
        <div className='weekly-stat-sub-label'>from last week</div>
      </div>
    </div>
  );
};

interface ThisWeekProps {
  stats: {
    assessmentStats: any; // TODO
    scorecardStats: StatProps;
  };
}

const ThisWeek = ({ stats }: ThisWeekProps) => {
  const {
    assessmentStats = {},
    scorecardStats = {} as StatProps
  } = stats;
  // TODO: format assessment stats better on the server
  const {
    today: todaysAssessments = {},
    thisWeek: thisWeekAssessments = {},
    lastWeek: lastWeekAssessments = {}
  } = assessmentStats;
  const {
    depression: todaysDepression,
    anxiety: todaysAnxiety,
    wellbeing: todaysWellBeing
  } = todaysAssessments;
  const {
    depression: thisWeekDepression,
    anxiety: thisWeekAnxiety,
    wellbeing: thisWeekWellBeing
  } = thisWeekAssessments;
  const {
    depression: lastWeekDepression,
    anxiety: lastWeekAnxiety,
    wellbeing: lastWeekWellBeing
  } = lastWeekAssessments;

  return (
    <div className='weekly-stats-container'>
      <ThisWeekStatsSection
        title='Productivity'
        statType={StatType.POSITIVE}
        formatter={(stat) => `${stat ? stat.toFixed(1) : '--'} points`}
        stats={scorecardStats} />

      <ThisWeekStatsSection
        title='Well-being'
        statType={StatType.POSITIVE}
        formatter={(stat) => `${stat ? stat.toFixed(1) : '--'}%`}
        stats={{
          today: todaysWellBeing,
          thisWeek: thisWeekWellBeing,
          lastWeek: lastWeekWellBeing
        }} />

      <ThisWeekStatsSection
        title='Depression'
        statType={StatType.NEGATIVE}
        formatter={(stat) => `${stat ? stat.toFixed(1) : '--'}%`}
        stats={{
          today: todaysDepression,
          thisWeek: thisWeekDepression,
          lastWeek: lastWeekDepression
        }} />

      <ThisWeekStatsSection
        title='Anxiety'
        statType={StatType.NEGATIVE}
        formatter={(stat) => `${stat ? stat.toFixed(1) : '--'}%`}
        stats={{
          today: todaysAnxiety,
          thisWeek: thisWeekAnxiety,
          lastWeek: lastWeekAnxiety
        }} />
    </div>
  );
};

export default ThisWeek;
