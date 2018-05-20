import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isNumber, isObject } from 'lodash';
import { resolve } from 'bluebird';
import * as moment from 'moment';
import NavBar from '../navbar';
import ChecklistOverview from './Checklist';
import ChecklistFlow from './ChecklistFlow';
import { IQuestion, fetchChecklistQuestions } from '../../helpers/checklist';
import { keyifyDate, isDateToday } from '../../helpers/utils';
import * as cache from '../../helpers/cache';
import './Checklist.less';

const CHECKLIST_CACHE_KEY = 'checklist';

interface ChecklistState {
  isLoading: boolean;
  date: moment.Moment;
  questions: IQuestion[];
}

class ChecklistSample extends React.Component<
  RouteComponentProps<{}>,
  ChecklistState
> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      date: moment(),
      questions: [],
      isLoading: true
    };
  }

  isValidState(obj: any) {
    if (!isObject(obj)) return false;

    const { date, questions } = obj;

    return questions && (questions.length === 25) && isDateToday(date);
  }

  getCachedState() {
    const state = cache.get(CHECKLIST_CACHE_KEY);

    if (this.isValidState(state)) {
      const { date } = state;

      return { ...state, date: moment(date) };
    } else {
      return null;
    }
  }

  setStateCache() {
    const { date } = this.state;

    return cache.set(CHECKLIST_CACHE_KEY, {
      ...this.state,
      date: date.format()
    });
  }

  componentDidMount() {
    const cache = this.getCachedState();

    if (cache) {
      this.setState(cache);

      return resolve();
    }

    return fetchChecklistQuestions()
      .then(questions => {
        return this.setState({
          questions,
          isLoading: false
        });
      })
      .catch(err => {
        console.log('Error fetching checklist questions!', err);
      });
  }

  componentDidUpdate() {
    return this.setStateCache();
  }

  handleScoreChange(question: IQuestion, score: number) {
    const { questions = [] } = this.state;
    const updates = questions.map(q => {
      return q.id === question.id ? { ...q, score } : q;
    });

    return this.setState({ questions: updates });
  }

  submit() {
    // TODO: link to summary view?
  }

  render() {
    const { isLoading, date, questions = [] } = this.state;
    const { history } = this.props;
    const isComplete = questions.every(q => isNumber(q.score));

    if (isLoading) return null;

    return (
      <div>
        <NavBar
          title='Check-in'
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

export default ChecklistSample;
