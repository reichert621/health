import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { all } from 'bluebird';
import {
  IAssessment,
  AssessmentType,
  fetchAssessmentsByDate,
  createAssessment
} from '../../helpers/assessment';
import { Entry, findOrCreateByDate, createEntry } from '../../helpers/entries';
import { DATE_FORMAT, getDefaultDate } from '../../helpers/utils';
import NavBar from '../navbar';
import './Reflect.less';
import { isNumber } from 'util';

interface AssessmentMenuItemProps {
  title: string;
  assessment: IAssessment;
  handleClick: () => void;
}

const AssessmentMenuItem = ({
  title,
  assessment,
  handleClick
}: AssessmentMenuItemProps) => {
  const { questions = [] } = assessment;
  const total = questions.length;
  const completed = questions.reduce((num, question) => {
    const { score } = question;

    return isNumber(score) ? num + 1 : num;
  }, 0);
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="reflection-menu-item" onClick={handleClick}>
      <div className="reflection-title">{title}</div>

      {assessment && assessment.id ? (
        <div>
          <div className="reflection-progress-container">
            <div
              className="reflection-progress-bar"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="reflection-action">
            {completed} / {total} Questions
          </div>
        </div>
      ) : (
        <div className="reflection-action">Start</div>
      )}
    </div>
  );
};

interface JournalMenuItemProps {
  entry: Entry;
  handleClick: () => void;
}

const JournalMenuItem = ({ entry, handleClick }: JournalMenuItemProps) => {
  return (
    <div className="reflection-menu-item" onClick={handleClick}>
      <div className="reflection-title">Journal</div>
      <div className="reflection-action">Write</div>
    </div>
  );
};

interface ReflectionProps extends RouteComponentProps<{}> {}

interface ReflectionState {
  isLoading: boolean;
  date: moment.Moment;
  assessments: { [type: string]: IAssessment };
  entry: Entry;
}

class Reflection extends React.Component<ReflectionProps, ReflectionState> {
  constructor(props: ReflectionProps) {
    super(props);

    const query = props.location.search;
    const date = getDefaultDate(query);

    this.state = {
      date: moment(date),
      isLoading: true,
      assessments: {},
      entry: null
    };
  }

  componentDidMount() {
    const { date } = this.state;
    const formatted = date.format(DATE_FORMAT);

    return all([
      fetchAssessmentsByDate(formatted),
      findOrCreateByDate(formatted)
    ])
      .then(([assessments, entry]) => {
        return this.setState({ assessments, entry, isLoading: false });
      })
      .catch(err => console.log('Error fetching assessments!', err));
  }

  getAssessmentTitle(type: AssessmentType) {
    switch (type) {
      case AssessmentType.DEPRESSION:
        return 'Depression Assessment';
      case AssessmentType.ANXIETY:
        return 'Anxiety Assessment';
      case AssessmentType.WELL_BEING:
        return 'Well-Being Assessment';
      default:
        throw new Error(`Invalid assessment type: ${type}`);
    }
  }

  findOrCreateAssessment(
    assessment: IAssessment,
    date: moment.Moment,
    type: AssessmentType
  ) {
    const { history } = this.props;

    if (assessment && assessment.id) {
      return history.push(`/assessment/${assessment.id}`);
    }

    const params = { type, date: date.format(DATE_FORMAT) };

    return createAssessment(params)
      .then(({ id: assessmentId }) => {
        return history.push(`/assessment/${assessmentId}`);
      })
      .catch(err => {
        console.log('Error creating assessment!', err);
      });
  }

  findOrCreateEntry(entry: Entry, date: moment.Moment) {
    const { history } = this.props;

    if (entry && entry.id) {
      return history.push(`/entry/${entry.id}`);
    }

    const params = {
      date: date.format(DATE_FORMAT),
      title: date.format(DATE_FORMAT),
      content: '',
      isPrivate: true
    };

    return createEntry(params).then(({ id: entryId }) => {
      return history.push(`/entry/${entryId}`);
    });
  }

  render() {
    const { isLoading, date, assessments, entry } = this.state;

    if (isLoading) {
      // TODO: handle loading state better
    }

    const types = [
      AssessmentType.DEPRESSION,
      AssessmentType.ANXIETY,
      AssessmentType.WELL_BEING
    ];

    return (
      <div className="default-wrapper simple">
        <NavBar active={'reflections'} />

        <div className="default-container simple">
          <div className="reflections-container">
            <h1 className="reflections-header">Reflections</h1>

            {types.map(type => {
              const assessment = assessments[type] || ({} as IAssessment);

              return (
                <AssessmentMenuItem
                  key={type}
                  title={this.getAssessmentTitle(type)}
                  assessment={assessment}
                  handleClick={() =>
                    this.findOrCreateAssessment(assessment, date, type)
                  }
                />
              );
            })}

            <JournalMenuItem
              entry={entry}
              handleClick={() => this.findOrCreateEntry(entry, date)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Reflection;
