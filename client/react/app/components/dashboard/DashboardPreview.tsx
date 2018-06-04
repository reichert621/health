import * as React from 'react';
import { Link } from 'react-router-dom';
import { isNumber, isArray, groupBy, keys, every } from 'lodash';
import * as moment from 'moment';
import { SelectedState, formatPoints, isDateToday } from '../../helpers/utils';
import { Task, calculateScore } from '../../helpers/tasks';
import { Entry } from '../../helpers/entries';
import { IScorecard } from '../../helpers/scorecard';
import { IChecklist, IQuestion } from '../../helpers/checklist';
import { IMood } from '../../helpers/mood';
import {
  IAssessment,
  IAssessmentsByType,
  AssessmentType
} from '../../helpers/assessment';
import MoodSelector from './MoodSelector';

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
  const { id: scorecardId, tasks = [] } = scorecard;
  const score = calculateScore(tasks);
  const completed = tasks.filter(t => t.isComplete);
  const grouped = groupBy(completed, 'category');
  const categories = keys(grouped);
  const hasCompleted = completed && (completed.length > 0);

  return (
    <div className='dashboard-scorecard-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Productivity
          <Link to={scorecardId ? `/scorecard/${scorecardId}` : '#'}
            onClick={handleClick}>
            {
              hasCompleted ?
                <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
                <img className='preview-icon' src='assets/pencil.svg' />
            }
          </Link>
        </h4>

        <Link className='preview-link text-active pull-right'
          to={scorecardId ? `/scorecard/${scorecardId}` : '#'}
          onClick={handleClick}>
          {hasCompleted ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points clearfix ${
        !hasCompleted ? 'hidden' : ''
      }`}>
        <span className='pull-left'>
          {completed.length} {completed.length === 1 ? 'accomplishment' : 'accomplishments'}
        </span>

        <span className='pull-right'>
          {score} {score === 1 ? 'point' : 'points'}
        </span>
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
  assessments: any; // FIXME
  selectedMood: IMood;
  handleMoodSelected: (mood: IMood) => Promise<any>;
  handleWellnessClicked: (e: any) => any;
  handleAnxietyClicked: (e: any) => any;
  handleDepressionClicked: (e: any) => any;
}

const ASSESSMENT_QUESTION_OPTIONS = 4;

const isAssessmentComplete = (questions: IQuestion[]) => {
  return isArray(questions) && questions.length && every(
    questions,
    q => isNumber(q.score)
  );
};

const getAssessmentPercentage = (points: number, questions: IQuestion[]) => {
  if (!points || !questions || !questions.length) {
    return 0;
  }

  const total = questions.length * ASSESSMENT_QUESTION_OPTIONS;

  return (points / total) * 100;
};

const DashboardChecklistPreview = ({
  checklist = {} as IChecklist,
  assessments = {} as any, // FIXME
  selectedMood,
  handleMoodSelected,
  handleWellnessClicked,
  handleAnxietyClicked,
  handleDepressionClicked
}: ChecklistPreviewProps) => {
  const {
    id: checklistId,
    questions: checklistQuestions = [],
    points: checklistPoints
  } = checklist;
  const { wellbeing = {}, anxiety = {}, depression = {} } = assessments;
  const {
    id: wellBeingId,
    questions: wellBeingQuestions = [],
    points: wellBeingPoints
  } = wellbeing;
  const {
    id: anxietyId,
    questions: anxietyQuestions = [],
    points: anxietyPoints
  } = anxiety;
  const checklistPercentage = getAssessmentPercentage(checklistPoints, checklistQuestions);
  const wellBeingPercentage = getAssessmentPercentage(wellBeingPoints, wellBeingQuestions);
  const anxietyPercentage = getAssessmentPercentage(anxietyPoints, anxietyQuestions);
  const isChecklistComplete = isAssessmentComplete(checklistQuestions);
  const isWellBeingComplete = isAssessmentComplete(wellBeingQuestions);
  const isAnxietyComplete = isAssessmentComplete(anxietyQuestions);
  const isAllComplete = (isChecklistComplete && isWellBeingComplete && isAnxietyComplete);

  return (
    <div className='dashboard-checklist-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Mental Health
          {
            (isAllComplete || selectedMood) ?
              <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
              null
          }
        </h4>
      </div>

      <div className='dashboard-mood-label'>
        How are you feeling today?
      </div>

      <div className='clearfix dashboard-depression-container'>
        <div className={`pull-left`}>
          {isWellBeingComplete
            ? `${wellBeingPercentage.toFixed(1)}% well-being`
            : 'Well-being'}
        </div>

        <Link className='text-blue pull-right'
          to={wellBeingId ? `/assessment/${wellBeingId}` : '#'}
          onClick={handleWellnessClicked}>
          {isWellBeingComplete ? 'View results' : 'Take assessment'}
          <img className={`forward-icon`}
            src='assets/back-arrow.svg' />
        </Link>
      </div>

      <div className='clearfix dashboard-depression-container'>
        <div className={`pull-left`}>
          {isAnxietyComplete
            ? `${anxietyPercentage.toFixed(1)}% anxiety`
            : 'Anxiety'}
        </div>

        <Link className='text-blue pull-right'
          to={anxietyId ? `/assessment/${anxietyId}` : '#'}
          onClick={handleAnxietyClicked}>
          {isAnxietyComplete ? 'View results' : 'Take assessment'}
          <img className={`forward-icon`}
            src='assets/back-arrow.svg' />
        </Link>
      </div>

      <div className='clearfix dashboard-depression-container'>
        <div className={`pull-left`}>
          {isChecklistComplete
            ? `${checklistPercentage.toFixed(1)}% depression`
            : 'Depression'}
        </div>

        <Link className='text-blue pull-right'
          to={checklistId ? `/checklist/${checklistId}` : '#'}
          onClick={handleDepressionClicked}>
          {isChecklistComplete ? 'View results' : 'Take assessment'}
          <img className={`forward-icon`}
            src='assets/back-arrow.svg' />
        </Link>
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
  const { id: entryId, content = '' } = entry;
  const hasContent = content && (content.length > 0);
  const wordCount = hasContent ? content.split(' ').length : 0;

  return (
    <div className='dashboard-entry-preview'>
      <div className='clearfix'>
        <h4 className='dashboard-preview-header section-header pull-left'>
          Journal
          <Link to={entryId ? `/entry/${entryId}` : '#'}
            onClick={handleClick}>
            {
              hasContent ?
                <img className='preview-icon checkmark' src='assets/checkmark.svg' /> :
                <img className='preview-icon' src='assets/pencil.svg' />
            }
          </Link>
        </h4>

        <Link className='preview-link text-active pull-right'
          to={entryId ? `/entry/${entryId}` : '#'}
          onClick={handleClick}>
          {hasContent ? 'View' : 'Start'}
        </Link>
      </div>

      <div className={`dashboard-preview-points ${!hasContent && 'hidden'}`}>
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  );
};

interface DashboardPreviewProps {
  isLoading?: boolean;
  selected: SelectedState;
  handleScorecardClicked: (scorecard: IScorecard, date: moment.Moment) => void;
  handleChecklistClicked: (checklist: IChecklist, date: moment.Moment) => void;
  handleEntryClicked: (entry: Entry, date: moment.Moment) => void;
  handleAssessmentClicked: (assessment: IAssessment, date: moment.Moment, type: AssessmentType) => void;
  handleMoodSelected?: (mood: IMood) => Promise<any>;
}

const DashboardPreview = ({
  isLoading = false,
  selected = {} as SelectedState,
  handleScorecardClicked,
  handleChecklistClicked,
  handleEntryClicked,
  handleAssessmentClicked,
  handleMoodSelected
}: DashboardPreviewProps) => {
  const { WELL_BEING, ANXIETY, DEPRESSION } = AssessmentType;
  const {
    scorecard,
    checklist,
    entry,
    mood,
    assessments = {},
    date = moment()
  } = selected;
  const isToday = isDateToday(date);
  const { wellbeing, anxiety, depression } = assessments;

  if (isLoading) {
    // TODO: handle loading state
  }

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
        assessments={assessments}
        selectedMood={mood}
        handleMoodSelected={handleMoodSelected}
        handleWellnessClicked={() => handleAssessmentClicked(wellbeing, date, WELL_BEING)}
        handleAnxietyClicked={() => handleAssessmentClicked(anxiety, date, ANXIETY)}
        handleDepressionClicked={() => handleChecklistClicked(checklist, date)} />

      <DashboardEntryPreview
        entry={entry}
        handleClick={() => handleEntryClicked(entry, date)} />
    </div>
  );
};

export default DashboardPreview;
