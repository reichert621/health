import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './CheckList.less';

const CheckLists = ({ checklists = [], limit = 40 }) => {
  return (
    <ul>
      {
        checklists
          .sort((x, y) => {
            return Number(new Date(y.date)) - Number(new Date(x.date));
          })
          .slice(0, limit)
          .map(({ id, date, points }, key) => {
            return (
              <li key={key}>
                <Link to={`/checklist/${id}`}>
                  {moment(date).format('MMM DD, YYYY')}
                </Link>
                <span>
                  {moment().isSame(moment(date), 'day') ? ' (Today)' : ''}
                </span>
                <div>
                  <small>({points} points)</small>
                </div>
              </li>
            );
          })
      }
    </ul>
  );
};

export default CheckLists;
