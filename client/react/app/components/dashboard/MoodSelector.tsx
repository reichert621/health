import * as React from 'react';
import * as moment from 'moment';
import { all } from 'bluebird';
import { keys, values } from 'lodash';
import {
  IMood,
  MoodCode,
  fetchMoodOptions
} from '../../helpers/mood';

const getMoodIcon = (code: MoodCode, isActive: boolean) => {
  // TODO: maybe this should be 'active' vs 'inactive' (instead of '')
  const suffix = isActive ? '-active' : '';

  switch (code) {
    case MoodCode.VERY_UNHAPPY:
      return `assets/moods/very-unhappy${suffix}.svg`;
    case MoodCode.UNHAPPY:
      return `assets/moods/unhappy${suffix}.svg`;
    case MoodCode.NEUTRAL:
      return `assets/moods/neutral${suffix}.svg`;
    case MoodCode.HAPPY:
      return `assets/moods/happy${suffix}.svg`;
    case MoodCode.VERY_HAPPY:
      return `assets/moods/very-happy${suffix}.svg`;
    default:
      throw new Error(`Invalid mood type: ${code}`);
  }
};

interface MoodSelectorProps {
  selectedMood: IMood;
  handleMoodSelected: (mood: IMood) => Promise<any>;
}

interface MoodSelectorState {
  moods: IMood[];
}

class MoodSelector extends React.Component<MoodSelectorProps, MoodSelectorState> {
  constructor(props: MoodSelectorProps) {
    super(props);

    this.state = {
      moods: []
    };
  }

  componentDidMount() {
    return fetchMoodOptions()
      .then((moods) => {
        return this.setState({ moods });
      })
      .catch(err => {
        console.log('Error fetching moods!', err);
      });
  }

  render() {
    const { moods = [] } = this.state;
    const { selectedMood = {} as IMood, handleMoodSelected } = this.props;
    const { code: selectedCode } = selectedMood;

    return (
      <div className='mood-selector-container'>
        {
          moods.map((mood, key) => {
            const { code } = mood;

            return (
              <img key={key}
                className='mood-icon'
                src={getMoodIcon(code, selectedCode === code)}
                onClick={() => handleMoodSelected(mood)} />
            );
          })
        }
      </div>
    );
  }
}

export default MoodSelector;
