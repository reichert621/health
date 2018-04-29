import * as React from 'react';
import { IChallenge } from '../../helpers/challenges';
import './Task.less';

interface ChallengeListProps {
  challenges: IChallenge[];
  onToggleChallenge: (challenge: IChallenge) => Promise<any>;
}

const ChallengeList = ({
  challenges = [],
  onToggleChallenge
}: ChallengeListProps) => {
  if (!challenges || !challenges.length) {
    return null;
  }

  return (
    <div>
      <h4 className='category-label'>
        Challenges
      </h4>
      <ul className='task-sublist'>
        {
          challenges.map((challenge, key) => {
            const { description, isSubscribed } = challenge;
            const shouldSubscribe = !isSubscribed;

            return (
              <li key={key}
                className='task-item-container'>
                <div className={`challenge-item ${
                  isSubscribed ? 'active' : 'inactive'}`
                }>
                  <span className='task-description'>
                    {description}
                  </span>
                  <button
                    className={`subscription-btn ${
                      isSubscribed ? 'btn-default' : 'btn-primary'
                    }`}
                    onClick={() => onToggleChallenge(challenge)}>
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                  </button>
                </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default ChallengeList;
