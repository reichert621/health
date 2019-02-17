import * as React from 'react';
import { times, isNumber } from 'lodash';
import { IQuestion } from '../../helpers/checklist';

const getScoreDescription = (score: number): string => {
  return (
    [
      'disagree',
      'somewhat agree',
      'agree',
      'strongly agree',
      'very strongly agree'
    ][score] || 'unanswered'
  );
};

interface AssessmentSelectorState {
  hovered?: number;
}

interface AssessmentSelectorProps {
  selected?: number;
  hovered?: number;
  handleSelect: (value: number) => void;
}

class AssessmentSelector extends React.Component<
  AssessmentSelectorProps,
  AssessmentSelectorState
> {
  constructor(props: AssessmentSelectorProps) {
    super(props);

    this.state = { hovered: -1 };
  }

  handleHover(val: number) {
    return this.setState({ hovered: val });
  }

  render() {
    const { hovered } = this.state;
    const { selected, handleSelect } = this.props;
    const score = hovered !== -1 ? hovered : selected;

    return (
      <div>
        <div className="assessment-selector">
          {times(5).map(n => {
            const isHovered = hovered >= n;
            const isSelected = selected >= n;

            return (
              <div
                key={n}
                className={`assessment-selector-item ${
                  isSelected ? 'selected' : ''
                } ${isHovered ? 'hovered' : ''}`}
                onClick={() => handleSelect(n)}
                onMouseEnter={() => this.handleHover(n)}
                onMouseLeave={() => this.handleHover(-1)}
              />
            );
          })}
        </div>
        <div
          className={`assessment-answer ${
            isNumber(selected) && hovered === -1 ? 'selected' : ''
          }`}
        >
          {getScoreDescription(score)}
        </div>
      </div>
    );
  }
}

interface AssessmentQuestionProps {
  question: IQuestion;
  isCurrent?: boolean;
  onSelect: (value: number) => void;
}

const AssessmentQuestion = ({
  question,
  onSelect,
  isCurrent
}: AssessmentQuestionProps) => {
  const { text, score } = question;

  return (
    <div
      className={`assessment-question-container clearfix ${
        isCurrent ? 'current' : ''
      }`}
    >
      <div className="assessment-question pull-left">{text}</div>
      <div className="assessment-selector-container pull-right">
        <AssessmentSelector selected={score} handleSelect={onSelect} />
      </div>
    </div>
  );
};

export default AssessmentQuestion;
