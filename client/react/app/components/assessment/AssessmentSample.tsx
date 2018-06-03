import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isNumber, isObject } from 'lodash';
import { resolve } from 'bluebird';
import * as moment from 'moment';
import NavBar from '../navbar';
import ChecklistOverview from '../checklist/Checklist';
import ChecklistFlow from '../checklist/ChecklistFlow';
import { IQuestion, fetchChecklistQuestions } from '../../helpers/checklist';
import { isAuthenticated } from '../../helpers/auth';
import { keyifyDate, isDateToday } from '../../helpers/utils';
import * as cache from '../../helpers/cache';
import {
  fetchAnxietyQuestions,
  fetchDepressionQuestions,
  fetchWellBeingQuestions
} from '../../helpers/assessment';
import '../checklist/Checklist.less';

interface AssessmentProps {
  cacheKey: string;
  fetchQuestions: () => Promise<IQuestion[]>;
}

interface AssessmentState {
  isLoading: boolean;
  date: moment.Moment;
  questions: IQuestion[];
}

class AssessmentSample extends React.Component<
  AssessmentProps & RouteComponentProps<{}>,
  AssessmentState
> {
  constructor(props: AssessmentProps & RouteComponentProps<{}>) {
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

    return questions && (questions.length >= 20) && isDateToday(date);
  }

  getCachedState() {
    const { cacheKey } = this.props;
    const state = cache.get(cacheKey);

    if (this.isValidState(state)) {
      const { date } = state;

      return { ...state, date: moment(date) };
    } else {
      return null;
    }
  }

  setStateCache() {
    const { cacheKey } = this.props;
    const { date } = this.state;

    return cache.set(cacheKey, {
      ...this.state,
      date: date.format()
    });
  }

  componentDidMount() {
    const { fetchQuestions } = this.props;
    const cache = this.getCachedState();

    if (cache) {
      this.setState(cache);

      return resolve();
    }

    return fetchQuestions()
      .then(questions => {
        return this.setState({
          questions,
          isLoading: false
        });
      })
      .catch(err => {
        console.log('Error fetching questions!', err);
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
    const { history } = this.props;

    return isAuthenticated()
      .then(isLoggedIn => {
        const next = isLoggedIn ? '/' : '/login';

        return history.push(next);
      })
      .catch(err => {
        console.log('Error checking authentication!', err);
      });
  }

  render() {
    const { isLoading, date, questions = [] } = this.state;
    const { history } = this.props;
    const isComplete = questions.every(q => isNumber(q.score));

    if (isLoading || !questions.length) return null;

    const [{ title = 'Assessment' }] = questions;

    return (
      <div>
        <NavBar
          title={title}
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

// TODO: try using HOC instead?
export class DepressionSample extends React.Component<RouteComponentProps<{}>> {
  render() {
    const cacheKey = 'assessments:depression';

    return <AssessmentSample
      {...this.props}
      cacheKey={cacheKey}
      fetchQuestions={fetchDepressionQuestions} />;
  }
}

export class AnxietySample extends React.Component<RouteComponentProps<{}>> {
  render() {
    const cacheKey = 'assessments:anxiety';

    return <AssessmentSample
      {...this.props}
      cacheKey={cacheKey}
      fetchQuestions={fetchAnxietyQuestions} />;
  }
}

export class WellBeingSample extends React.Component<RouteComponentProps<{}>> {
  render() {
    const cacheKey = 'assessments:wellbeing';

    return <AssessmentSample
      {...this.props}
      cacheKey={cacheKey}
      fetchQuestions={fetchWellBeingQuestions} />;
  }
}
