import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isNumber, isObject } from 'lodash';
import { resolve } from 'bluebird';
import * as moment from 'moment';
import NavBar from '../navbar';
import ChecklistOverview from '../checklist/Checklist';
import ChecklistFlow from '../checklist/ChecklistFlow';
import { IQuestion } from '../../helpers/checklist';
import { isAuthenticated } from '../../helpers/auth';
import { keyifyDate, isDateToday } from '../../helpers/utils';
import {
  IAssessment,
  fetchAssessment,
  updateAssessmentScore
} from '../../helpers/assessment';
import '../checklist/Checklist.less';

interface AssessmentProps {}

interface AssessmentState {
  isLoading: boolean;
  assessment: IAssessment;
  date: moment.Moment;
  questions: IQuestion[];
}

class AssessmentContainer extends React.Component<
  AssessmentProps & RouteComponentProps<{ id: number }>,
  AssessmentState
> {
  constructor(props: AssessmentProps & RouteComponentProps<{ id: number }>) {
    super(props);

    this.state = {
      assessment: null,
      date: moment(),
      questions: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    const { id: assessmentId } = match.params;

    return fetchAssessment(assessmentId)
      .then(assessment => {
        const { questions, date } = assessment;

        return this.setState({
          assessment,
          questions,
          date: moment(date),
          isLoading: false
        });
      })
      .catch(err => {
        console.log('Error fetching assessment!', err);
      });
  }


  handleScoreChange(question: IQuestion, score: number) {
    const { assessment, questions = [] } = this.state;
    const { id: assessmentId } = assessment;
    const { id: questionId } = question;
    const updates = questions.map(q => {
      return q.id === question.id ? { ...q, score } : q;
    });

    return updateAssessmentScore(assessmentId, questionId, score)
      .then(res => {
        return this.setState({ questions: updates });
      })
      .catch(err => {
        console.log('Error updating score!', err);
      });
  }

  submit() {
    const { history } = this.props;
    const { date } = this.state;
    const isToday = isDateToday(date);
    const url = isToday ? '/today' : '/dashboard';

    return history.push(url);
  }

  render() {
    const { isLoading, assessment, date, questions = [] } = this.state;
    const { history } = this.props;
    const isComplete = questions.every(q => isNumber(q.score));
    const isToday = isDateToday(date);
    const url = isToday ? '/today' : '/dashboard';

    if (isLoading || !assessment || !questions.length) {
      return null;
    }

    const { title } = assessment;

    return (
      <div>
        <NavBar
          title={title}
          history={history}
          linkTo={url} />
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

export default AssessmentContainer;
