import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
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
import { AppState, formatPoints } from '../../helpers/utils';
import { getChecklist, updateScore } from '../../reducers';
import './Checklist.less';

interface ChecklistProps {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
  isComplete: boolean;
  dispatch: (action: any) => Promise<any>;
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
    // return fetchChecklist(id)
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

  calculateScore(questions: IQuestion[]) {
    return questions.reduce((score: number, question: IQuestion) => {
      return question.score ? (score + question.score) : score;
    }, 0);
  }

  submit() {
    const { history } = this.props;

    return history.push('/dashboard');
  }

  render() {
    const { isLoading } = this.state;
    const { checklist, questions, date, isComplete, history } = this.props;

    if (isLoading) return null;

    return (
      <div>
        <NavBar
          title='Check-in'
          linkTo='/dashboard'
          history={history} />
        {
          isComplete ?
            <ChecklistOverview
              date={date}
              checklist={checklist}
              questions={questions}
              onScoreChange={this.handleScoreChange.bind(this)}
              onSubmit={this.submit.bind(this)} /> :
            <ChecklistFlow
              date={date}
              checklist={checklist}
              questions={questions}
              onScoreChange={this.handleScoreChange.bind(this)}
              onSubmit={this.submit.bind(this)} />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(ChecklistContainer);
