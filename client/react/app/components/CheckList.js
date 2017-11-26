import React from 'react';
import { groupBy, keys } from 'lodash';
import './CheckList.less';

const getQuestions = () => {
  return [
    { id: 1, text: 'Feeling sad or down in the dumps', score: null },
    { id: 2, text: 'Feeling unhappy or blue', score: null },
    { id: 3, text: 'Crying spells or tearfulness', score: null },
    { id: 4, text: 'Feeling discouraged', score: null },
    { id: 5, text: 'Feeling hopeless', score: null },
    { id: 6, text: 'Low self-esteem', score: null },
    { id: 7, text: 'Feeling worthless or inadequate', score: null },
    { id: 8, text: 'Guilt or shame', score: null },
    { id: 9, text: 'Criticizing yourself or blaming yourself', score: null },
    { id: 10, text: 'Difficulty making decisions', score: null },
    { id: 11, text: 'Loss of interest in family, friends, or colleagues', score: null },
    { id: 12, text: 'Loneliness', score: null },
    { id: 13, text: 'Spending less time with family or friends', score: null },
    { id: 14, text: 'Loss of motivation', score: null },
    { id: 15, text: 'Loss of interest in work or other activities', score: null },
    { id: 16, text: 'Avoiding work or other activities', score: null },
    { id: 17, text: 'Loss of pleasure or satisfaction in life', score: null },
    { id: 18, text: 'Feeling tired', score: null },
    { id: 19, text: 'Difficulty sleeping or sleeping too much', score: null },
    { id: 20, text: 'Decreased or increased appetite', score: null },
    { id: 21, text: 'Loss of interest in sex', score: null },
    { id: 22, text: 'Worrying about your health', score: null },
    { id: 23, text: 'Do you have any suicidal thoughts?', score: null },
    { id: 24, text: 'Would you like to end your life?', score: null },
    { id: 25, text: 'Do you have a plan for harming yourself?', score: null }
  ];
};

const getScoreOptions = () => {
  return [
    { value: 'zero', score: 0 },
    { value: 'one', score: 1 },
    { value: 'two', score: 2 },
    { value: 'three', score: 3 },
    { value: 'four', score: 4 }
  ];
};

const ChecklistQuestion = ({ question, onSelect }) => {
  const options = getScoreOptions();
  const style = {
    marginRight: 10
  };

  return (
    <div>
      <span style={style}>{question.text}</span>
      <span style={style}>
        {
          options.map((option, key) => {
            const { value, score } = option;

            return (
              <label key={key}>
                <input
                  type="radio"
                  value={value}
                  checked={question.score === score}
                  onChange={(e) => onSelect(score)} />
              </label>
            )
          })
        }
      </span>
    </div>
  );
};

class CheckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: getQuestions()
    };
  }

  handleScoreChange(question, score) {
    const { questions } = this.state;
    const update = questions.map(q =>
      (q.id === question.id) ? { ...q, score } : q);

    return this.setState({ questions: update });
  }

  calculateScore(questions) {
    return questions.reduce((score, question) =>
      question.score ? (score + question.score) : score, 0);
  }

  render() {
    const { questions } = this.state;

    return (
      <div className="default-container">
        <h1>
          Depression Checklist
        </h1>

        <div className="component-container">
          {
            questions.map((question, key) => {
              return (
                <ChecklistQuestion
                  key={key}
                  question={question}
                  onSelect={this.handleScoreChange.bind(this, question)} />
              );
            })
          }
        </div>

        <h2>
          Total Score: {this.calculateScore(questions)}
        </h2>
      </div>
    );
  }
}

export default CheckList;
