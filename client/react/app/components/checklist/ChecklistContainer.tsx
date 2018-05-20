import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { isNumber } from 'lodash';
import * as moment from 'moment';
import NavBar from '../navbar';
import ChecklistOverview from './Checklist';
import ChecklistFlow from './ChecklistFlow';
import {
  IChecklist,
  IQuestion,
  fetchChecklist,
  updateChecklistScore
} from '../../helpers/checklist';
import { AppState, formatPoints, isDateToday } from '../../helpers/utils';
import { getChecklist, updateScore } from '../../reducers';
import './Checklist.less';

interface ChecklistProps {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
  isComplete: boolean;
  dispatch: Dispatch<Promise<any>>;
}

interface ChecklistState {
  isLoading: boolean;
}

// TODO: clean this up a bit... just using for caching right now
const mapStateToProps = (state: AppState) => {
  const { selected, checklists, questions: defaultQuestions } = state;
  const { date, checklist: selectedChecklist = {} as IChecklist } = selected;
  const { byId: checklistsById } = checklists;
  const { id: checklistId } = selectedChecklist;
  const checklist = checklistsById[checklistId] || {} as IChecklist;
  const { questions = [] } = checklist;
  const isComplete = questions.every(q => isNumber(q.score));

  return {
    date,
    checklist,
    isComplete,
    questions: questions || defaultQuestions
  };
};

class ChecklistContainer extends React.Component<
  ChecklistProps & RouteComponentProps<{ id: number }>,
  ChecklistState
> {
  constructor(props: ChecklistProps & RouteComponentProps<{ id: number }>) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const { match, history, dispatch } = this.props;
    const { id } = match.params;

    // In redux, cache questions with `id`, `text`, and `category` fields
    return dispatch(getChecklist(id))
      .then(() => {
        return this.setState({
          isLoading: false
        });
      })
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching checklist!', err);
      });
  }

  handleScoreChange(question: IQuestion, score: number) {
    const { dispatch, checklist } = this.props;

    return dispatch(updateScore(checklist, question, score));
  }

  submit() {
    const { history, date } = this.props;
    const isToday = isDateToday(date);
    const url = isToday ? '/today' : '/dashboard';

    return history.push(url);
  }

  render() {
    const { isLoading } = this.state;
    const { checklist, questions, date, isComplete, history } = this.props;
    const isToday = isDateToday(date);
    const url = isToday ? '/today' : '/dashboard';

    if (isLoading) return null;

    return (
      <div>
        <NavBar
          title='Check-in'
          linkTo={url}
          history={history} />
        {
          isComplete ?
            <ChecklistOverview
              date={date}
              questions={questions}
              onScoreChange={this.handleScoreChange.bind(this)}
              onSubmit={this.submit.bind(this)} /> :
            <ChecklistFlow
              date={date}
              questions={questions}
              onScoreChange={this.handleScoreChange.bind(this)}
              onSubmit={this.submit.bind(this)} />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(ChecklistContainer);
