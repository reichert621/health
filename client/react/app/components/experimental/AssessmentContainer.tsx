import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isNumber } from 'lodash';
import { resolve } from 'bluebird';
import * as moment from 'moment';
import NavBar from '../navbar';
import Assessment from './Assessment';
import { IQuestion } from '../../helpers/checklist';
import { isAuthenticated } from '../../helpers/auth';
import { isDateToday } from '../../helpers/utils';
import {
  IAssessment,
  fetchAssessment,
  updateAssessmentScore
} from '../../helpers/assessment';
import './Assessment.less';

interface AssessmentProps {}

interface AssessmentState {
  isLoading: boolean;
  assessment: IAssessment;
  date: moment.Moment;
  questions: IQuestion[];
  forceDisplayList: boolean;
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
      forceDisplayList: false,
      isLoading: true
    };
  }

  componentDidMount() {
    const { match } = this.props;
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
      .then(() => {
        return this.setState({ questions: updates });
      })
      .catch(err => {
        console.log('Error updating score!', err);
      });
  }

  submit() {
    const { history } = this.props;

    return history.push('/reflect');
  }


  render() {
    const {
      isLoading,
      assessment,
      date,
      questions = []
    } = this.state;
    const { history } = this.props;
    const isComplete = questions.every(q => isNumber(q.score));

    if (isLoading || !assessment || !questions.length) {
      return null;
    }

    const { title } = assessment;

    return (
      <div>
        <NavBar active={'reflections'} />

        <Assessment
          title={title}
          date={date}
          questions={questions}
          onScoreChange={this.handleScoreChange.bind(this)}
          onSubmit={this.submit.bind(this)} />
      </div>
    );
  }
}

export default AssessmentContainer;
