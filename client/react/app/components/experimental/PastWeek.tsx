import * as React from 'react';
import * as moment from 'moment';
import { times } from 'lodash';
import { DATE_FORMAT } from '../../helpers/utils';

const PastWeek = ({ dates }: { dates: string[] }) => {
  const days = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
  const completedDates = dates.reduce(
    (acc, date) => {
      const key = moment(date).format(DATE_FORMAT);

      return { ...acc, [key]: true };
    },
    {} as { [date: string]: boolean }
  );

  const pastWeekDates = times(7, n => {
    const date = moment().subtract(n, 'days');
    const day = days[date.day()];
    const formatted = moment(date).format(DATE_FORMAT);
    const label = day.slice(0, 1).toUpperCase();

    return { day, label, isComplete: completedDates[formatted] };
  }).reverse();

  return (
    <div className="activity-past-week-container" style={{ marginBottom: 32 }}>
      <div className="activity-labels-container">
        <div className="activity-details-label">Past Week</div>

        <div className="activity-details-label text-heavy">Today</div>
      </div>

      <div className="activity-past-week">
        {pastWeekDates.map(({ day, label, isComplete }) => {
          const completed = isComplete ? 'completed' : '';

          return (
            <div key={day} className={`activity-week-day ${day} ${completed}`}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastWeek;
