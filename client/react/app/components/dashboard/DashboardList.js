import React from 'react';
import { keyifyDate, formatPoints, mapByDate } from '../../helpers/utils';

const DashboardList = ({
  dates = [],
  scorecards = [],
  checklists = [],
  handleDateSelected
}) => {
  const scorecardsByDate = mapByDate(scorecards);
  const checklistsByDate = mapByDate(checklists);

  return (
    <table className="dashboard-list-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Productivity</th>
          <th>Depression</th>
        </tr>
      </thead>
      <tbody>
        {
          dates.map(date => {
            const key = keyifyDate(date);
            const scorecard = scorecardsByDate[key];
            const checklist = checklistsByDate[key];

            return (
              <tr key={key}
                className="dashboard-list-row"
                onClick={() => handleDateSelected(date)}>
                <td className="text-blue">
                  <span className="dashboard-list-date">
                    {date.format('ddd MM/DD')}
                  </span>
                </td>
                <td>{scorecard ? formatPoints(scorecard.points) : '--'}</td>
                <td>{checklist ? formatPoints(checklist.points) : '--'}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default DashboardList;
