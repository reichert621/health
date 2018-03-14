import React from 'react';
import { Link } from 'react-router-dom';
import { isNumber, groupBy, keys } from 'lodash';
import moment from 'moment';
import { formatPoints } from '../../helpers/utils';

// TODO: DRY this up (see ScoreCardOverview)
const DashboardCategorySubtasks = ({ category, subtasks }) => {
  return (
    <div>
      <div className="scorecard-overview-category-label">
        {category}
      </div>
      {
        subtasks.map((task, key) => {
          const { description, points } = task;
          return (
            <div
              key={key}
              className="scorecard-overview-completed-task clearfix">
              <span className="pull-left">{description}</span>
              <span className="pull-right">
                {formatPoints(points)}
              </span>
            </div>
          );
        })
      }
    </div>
  );
};

// TODO: clean up these preview components
const DashboardScorecardPreview = ({ scorecard = {}, handleClick }) => {
  const { id: scorecardId, points, tasks = [] } = scorecard;
  const completed = tasks.filter(t => t.isComplete);
  const grouped = groupBy(completed, 'category');
  const categories = keys(grouped);

  return (
    <div className="dashboard-scorecard-preview">
      <div className="clearfix">
        <h4 className="dashboard-preview-header section-header pull-left">
          Scorecard
          {
            scorecardId ?
              <img className="preview-icon checkmark" src="assets/checkmark.svg" /> :
              <img className="preview-icon" src="assets/pencil.svg" />
          }
        </h4>

        <Link className="preview-link text-active pull-right"
          to={scorecardId ? `/scorecard/${scorecardId}` : '#'}
          onClick={handleClick}>
          {scorecardId ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points ${
        !isNumber(points) ? 'hidden' : ''
      }`}>
        {points} productivity {points === 1 ? 'point' : 'points'}
      </div>

      <div className="dashboard-preview-scorecard-overview">
        {
          categories.map((category, key) => {
            const subtasks = grouped[category];

            return (
              <DashboardCategorySubtasks
                key={key}
                category={category}
                subtasks={subtasks} />
            );
          })
        }
      </div>
    </div>
  );
};

const DashboardChecklistPreview = ({ checklist = {}, handleClick }) => {
  const { id: checklistId, points } = checklist;

  return (
    <div className="dashboard-checklist-preview">
      <div className="clearfix">
        <h4 className="dashboard-preview-header section-header pull-left">
          Check-in
          {
            checklistId ?
              <img className="preview-icon checkmark" src="assets/checkmark.svg" /> :
              <img className="preview-icon" src="assets/pencil.svg" />
          }
        </h4>

        <Link className="preview-link text-active pull-right"
          to={checklistId ? `/checklist/${checklistId}` : '#'}
          onClick={handleClick}>
          {checklistId ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points ${!isNumber(points) && 'hidden'}`}>
        {points} depression {points === 1 ? 'point' : 'points'}
      </div>
    </div>
  );
};

const DashboardEntryPreview = ({ entry = {}, handleClick }) => {
  const { id: entryId, content } = entry;
  const hasContent = content && (content.length > 0);

  return (
    <div className="dashboard-entry-preview">
      <div className="clearfix">
        <h4 className="dashboard-preview-header section-header pull-left">
          Log
          {
            hasContent ?
              <img className="preview-icon checkmark" src="assets/checkmark.svg" /> :
              <img className="preview-icon" src="assets/pencil.svg" />
          }
        </h4>

        <Link className="preview-link text-active pull-right"
          to={entryId ? `/entry/${entryId}` : '#'}
          onClick={handleClick}>
          {hasContent ? 'View' : 'Start'}
        </Link>
      </div>
    </div>
  );
};

class DashboardPreview extends React.Component {
  render() {
    const {
      selected = {},
      handleScorecardClicked,
      handleChecklistClicked,
      handleEntryClicked
    } = this.props;
    const { scorecard, checklist, entry, date = moment() } = selected;
    const isToday = moment(date).isSame(moment(), 'day');

    return (
      <div className="dashboard-preview">
        <h4 className="dashboard-preview-header date-header">
          <div className={isToday && 'date-today'}>
            {isToday ? 'Today' : date.format('dddd')}
          </div>
          <div className="date-subheader">{date.format('MMMM DD, YYYY')}</div>
        </h4>

        <DashboardScorecardPreview
          scorecard={scorecard}
          date={date}
          handleClick={() => handleScorecardClicked(scorecard, date)} />

        <DashboardChecklistPreview
          checklist={checklist}
          handleClick={() => handleChecklistClicked(checklist, date)} />

        <DashboardEntryPreview
          entry={entry}
          handleClick={() => handleEntryClicked(entry, date)} />
      </div>
    );
  }
}

export default DashboardPreview;
