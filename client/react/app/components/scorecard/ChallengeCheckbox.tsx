import * as React from 'react';
import { isArray } from 'lodash';
import { IChallenge, IAccomplisher } from '../../helpers/challenges';

interface CheckInProps {
  isComplete: boolean;
  checkins: IAccomplisher[];
}

const CheckIns = ({ isComplete, checkins }: CheckInProps) => {
  // TODO: maybe show other people who did the challenge in a tooltip?
  const count = isArray(checkins) ? checkins.length : 0;

  if (count === 0) {
    return (
      <span className='checkbox-label text-gray pull-right'>
        Be the first to check in
      </span>
    );
  }

  if (isComplete) {
    const text = (count === 1)
      ? 'You checked in!'
      : `You + ${count - 1} check-${count - 1 === 1 ? 'in' : 'ins'}`;

    return (
      <span className='checkbox-label on pull-right'>
        {text}
      </span>
    );
  }

  return (
    <span className='checkbox-label off pull-right'>
      {count} check-{count === 1 ? 'in' : 'ins'}
    </span>
  );
};

interface CheckboxProps {
  challenge: IChallenge;
  onToggle: () => void;
}

const ChallengeCheckbox = ({ challenge, onToggle }: CheckboxProps) => {
  const { id, description, isComplete = false, accomplishers = [] } = challenge;

  return (
    <label className='checkbox-container unselectable clearfix'>
      <input
        type='checkbox'
        id={`challenge-${id}`}
        value={description}
        checked={isComplete}
        onChange={onToggle} />
      <div className={`checkbox-indicator ${isComplete ? 'on' : 'off'}`} />
      <span
        className={`checkbox-label pull-left ${isComplete ? 'on' : 'off'}`}>
        {description}
      </span>

      <CheckIns
        isComplete={isComplete}
        checkins={accomplishers} />
    </label>
  );
};

export default ChallengeCheckbox;
