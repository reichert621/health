import * as React from 'react';
import { filter, some } from 'lodash';
import { Task, NewTask } from '../../helpers/tasks';
import './Task.less';

interface SuggestionsListProps {
  suggestions: NewTask[];
  isVisible: boolean;
  onAddSuggestion: (suggestion: NewTask) => Promise<any>;
}

const SuggestionsList = ({
  suggestions = [],
  isVisible,
  onAddSuggestion
}: SuggestionsListProps) => {
  if (!isVisible || !suggestions || !suggestions.length) {
    return null;
  }

  return (
    <div>
      <h4 className='category-label'>
        Suggestions
      </h4>
      <ul className='task-sublist'>
        {
          suggestions.map((suggestion, key) => {
            const { description, category } = suggestion;

            return (
              <li key={key}
                className='task-item-container'>
                <div className='challenge-item'>
                  <span className='task-description'>
                    <span className='text-active'>{category}</span>: {description}
                  </span>
                  <button
                    className='btn-primary'
                    onClick={() => onAddSuggestion(suggestion)}>
                    Add
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

export default SuggestionsList;
