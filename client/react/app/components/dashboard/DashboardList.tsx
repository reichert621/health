import * as React from 'react';
import * as moment from 'moment';
import {
  SelectedState,
  keyifyDate,
  formatPoints,
  mapByDate,
  getFormattedPercentage
} from '../../helpers/utils';
import { IScorecard } from '../../helpers/scorecard';
import { IChecklist } from '../../helpers/checklist';
import { IAssessment, AssessmentType } from '../../helpers/assessment';

interface DashboardListProps {
  dates: moment.Moment[];
  scorecards: IScorecard[];
  checklists: IChecklist[];
  assessments: IAssessment[];
  selected: SelectedState;
  handleDateSelected: (date: moment.Moment) => void;
}

const DashboardList = ({
  dates = [],
  scorecards = [],
  checklists = [],
  assessments = [],
  selected = {} as SelectedState,
  handleDateSelected
}: DashboardListProps) => {
  const { WELL_BEING, ANXIETY, DEPRESSION } = AssessmentType;
  const wellBeingAssessments = assessments.filter(a => a.type === WELL_BEING);
  const anxietyAssessments = assessments.filter(a => a.type === ANXIETY);
  const depressionAssessments = assessments.filter(a => a.type === DEPRESSION);
  const wellBeingByDate = mapByDate(wellBeingAssessments);
  const anxietyByDate = mapByDate(anxietyAssessments);
  const depressionByDate = mapByDate(depressionAssessments);
  const scorecardsByDate = mapByDate(scorecards);
  const checklistsByDate = mapByDate(checklists);
  const { date: selectedDate } = selected;
  const selectedKey = keyifyDate(selectedDate);

  return (
    <table className='dashboard-list-table'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Productivity</th>
          <th>Well-Being</th>
          <th>Anxiety</th>
          <th>Depression</th>
        </tr>
      </thead>
      <tbody>
        {
          dates.map(date => {
            const key = keyifyDate(date);
            const isSelected = (key === selectedKey);
            const wellBeing = wellBeingByDate[key];
            const anxiety = anxietyByDate[key];
            const depression = depressionByDate[key];
            const scorecard = scorecardsByDate[key];

            return (
              <tr key={key}
                className={`dashboard-list-row ${isSelected && 'selected'}`}
                onClick={() => handleDateSelected(date)}>
                <td className={isSelected ? '' : 'text-blue'}>
                  <span className='dashboard-list-date'>
                    {date.format('ddd MM/DD')}
                  </span>
                </td>
                <td>{scorecard ? formatPoints(scorecard.points) : '--'}</td>
                <td>
                  {wellBeing
                    ? `${getFormattedPercentage(wellBeing.points, 80)}%`
                    : '--'}
                </td>
                <td>
                  {anxiety
                    ? `${getFormattedPercentage(anxiety.points, 100)}%`
                    : '--'}
                </td>
                <td>
                  {depression
                    ? `${getFormattedPercentage(depression.points, 100)}%`
                    : '--'}
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default DashboardList;
