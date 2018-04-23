import * as React from 'react';
import { Link } from 'react-router-dom';
import { isNumber, groupBy, keys } from 'lodash';
import * as moment from 'moment';
import { SelectedState, formatPoints } from '../../helpers/utils';
import { Task } from '../../helpers/tasks';
import { Entry } from '../../helpers/entries';
import { IScorecard } from '../../helpers/scorecard';
import { IChecklist } from '../../helpers/checklist';

interface CategorySubtasksProps {
  category: string;
  subtasks: Task[];
}

// TODO: DRY this up (see ScoreCardOverview)
const DashboardCategorySubtasks = ({
  category,
  subtasks
}: CategorySubtasksProps) => {
  return (
    <div>
      <div className='scorecard-overview-category-label'>
        {category}
      </div>
      {
        subtasks.map((task, key) => {
          const { description, points } = task;
          return (
            <div
              key={key}
              className='scorecard-overview-completed-task clearfix'>
              <span className='pull-left'>{description}</span>
              <span className='pull-right'>
                {formatPoints(points)}
              </span>
            </div>
          );
        })
      }
    </div>
  );
};

interface ScorecardPreviewProps {
  scorecard: IScorecard;
  handleClick: (e: any) => void;
}

// TODO: clean up these preview components
const DashboardScorecardPreview = ({
  scorecard = {} as IScorecard,
  handleClick
}: ScorecardPreviewProps) => {
  const { id: scorecardId, points, tasks = [] } = scorecard;
  const completed = tasks.filter(t => t.isComplete);
  const grouped = groupBy(completed, 'category');
  const categories = keys(grouped);

  return (
    <div className='dashboard-scorecard-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Scorecard
          {
            scorecardId ?
              <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
              <img className='preview-icon' src='assets/pencil.svg' />
          }
        </h4>

        <Link className='preview-link text-active pull-right'
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

      <div className='dashboard-preview-scorecard-overview'>
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

interface ChecklistPreviewProps {
  checklist: IChecklist;
  handleClick: (e: any) => void;
}

const DashboardChecklistPreview = ({
  checklist = {} as IChecklist,
  handleClick
}: ChecklistPreviewProps) => {
  const { id: checklistId, points } = checklist;

  return (
    <div className='dashboard-checklist-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Check-in
          {
            checklistId ?
              <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
              <img className='preview-icon' src='assets/pencil.svg' />
          }
        </h4>

        <Link className='preview-link text-active pull-right'
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

interface EntryPreviewProps {
  entry: Entry;
  handleClick: (e: any) => void;
}

const DashboardEntryPreview = ({
  entry = {} as Entry,
  handleClick
}: EntryPreviewProps) => {
  const { id: entryId, content } = entry;
  const hasContent = content && (content.length > 0);

  return (
    <div className='dashboard-entry-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Log
          {
            hasContent ?
              <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
              <img className='preview-icon' src='assets/pencil.svg' />
          }
        </h4>

        <Link className='preview-link text-active pull-right'
          to={entryId ? `/entry/${entryId}` : '#'}
          onClick={handleClick}>
          {hasContent ? 'View' : 'Start'}
        </Link>
      </div>
    </div>
  );
};

interface DashboardPreviewProps {
  selected: SelectedState;
  handleScorecardClicked: (scorecard: IScorecard, date: moment.Moment) => void;
  handleChecklistClicked: (checklist: IChecklist, date: moment.Moment) => void;
  handleEntryClicked: (entry: Entry, date: moment.Moment) => void;
}

const DashboardPreview = ({
  selected = {} as SelectedState,
  handleScorecardClicked,
  handleChecklistClicked,
  handleEntryClicked
}: DashboardPreviewProps) => {
  const { scorecard, checklist, entry, date = moment() } = selected;
  const isToday = moment(date).isSame(moment(), 'day');

  return (
    <div className='dashboard-preview'>
      <h4 className='dashboard-preview-header date-header'>
        <div className={isToday && 'date-today'}>
          {isToday ? 'Today' : date.format('dddd')}
        </div>
        <div className='date-subheader'>{date.format('MMMM DD, YYYY')}</div>
      </h4>

      <DashboardScorecardPreview
        scorecard={scorecard}
        handleClick={() => handleScorecardClicked(scorecard, date)} />

      <DashboardChecklistPreview
        checklist={checklist}
        handleClick={() => handleChecklistClicked(checklist, date)} />

      <DashboardEntryPreview
        entry={entry}
        handleClick={() => handleEntryClicked(entry, date)} />
    </div>
  );
};

export default DashboardPreview;