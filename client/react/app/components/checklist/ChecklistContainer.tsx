import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { isNumber } from 'lodash';
import * as moment from 'moment';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../navbar';
import ChecklistOverview from './Checklist';
import ChecklistFlow from './ChecklistFlow';
// // import ChecklistQuestion from './ChecklistQuestion';
import {
  IChecklist,
  IQuestion,
  fetchChecklist,
  updateChecklistScores
} from '../../helpers/checklist';
import { AppState, formatPoints } from '../../helpers/utils';
import { getChecklist } from '../../reducers';
import './CheckList.less';

interface ChecklistProps {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
  isComplete: boolean;
  dispatch: (action: any) => any;
}

interface ChecklistState {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
  isComplete: boolean;
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
    const {
      checklist = {} as IChecklist,
      date = moment(),
      questions = [] as IQuestion[],
      isComplete = false
    } = this.props;

    this.state = {
      checklist,
      date,
      questions,
      isComplete,
      isLoading: true
    };
  }

  componentDidMount() {
    const { match, history, dispatch } = this.props;
    const { id } = match.params;

    dispatch(getChecklist(id));
    // In redux, cache questions with `id`, `text`, and `category` fields
    return fetchChecklist(id)
      .then(checklist => {
        const { questions = [], date } = checklist;
        const isComplete = questions.every(q => isNumber(q.score));

        return this.setState({
          checklist,
          questions,
          isComplete,
          date: moment(date),
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
    const { questions } = this.state;
    const update = questions.map(q => {
      return (q.id === question.id) ? { ...q, score } : q;
    });

    return this.setState({ questions: update });
  }

  calculateScore(questions: IQuestion[]) {
    return questions.reduce((score: number, question: IQuestion) => {
      return question.score ? (score + question.score) : score;
    }, 0);
  }

  submit() {
    const { questions, checklist } = this.state;
    const { history } = this.props;
    const { id: checklistId } = checklist;

    const scores = questions
      .filter(q => isNumber(q.score))
      .map(({ id, score, checklistScoreId }) => {
        return {
          score,
          checklistId,
          checklistScoreId,
          checklistQuestionId: id
        };
      });

    return updateChecklistScores(checklistId, { scores })
      .then(res => {
        return history.push('/dashboard');
      })
      .catch(err => console.log('Error updating scores!', err));
  }

  render() {
    const { checklist, questions, date, isComplete, isLoading } = this.state;
    const { history } = this.props;

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
