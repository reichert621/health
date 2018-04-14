// NB: this is identical to DailyGratitude.tsx
// aside from some minor UI simplifications
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as Modal from 'react-modal';
import { get, has, find } from 'lodash';
import *  as moment from 'moment';
import { resolve, reject } from 'bluebird';
import NavBar from '../navbar';
import {
  IGratitude,
  fetchGratitudes,
  getDefaultGratitude,
  getTodaysGratitude,
  getRecentPastGratitudes,
  createOrUpdate,
  deleteGratitude
} from '../../helpers/gratitudes';
import './SelfActivation.less';

// Reference: http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement('#app');

interface TimerProps {
  gratitude: string;
  onClose: () => void;
}

interface TimerState {
  progress: number;
  timer?: number;
}

class GratitudeTimer extends React.Component<TimerProps, TimerState> {
  constructor(props: TimerProps) {
    super(props);

    this.state = {
      progress: 0,
      timer: null
    };
  }

  componentDidMount() {
    return this.startTimer();
  }

  componentWillUnmount() {
    const { timer } = this.state;

    window.clearInterval(timer);
  }

  startTimer() {
    const max = 60;
    const timer = window.setInterval(() => {
      const { progress } = this.state;

      if (progress < max) {
        this.setState({ progress: progress + 1 });
      } else {
        window.clearInterval(timer);

        this.setState({ progress: max, timer: null });
      }
    }, 1000);

    return this.setState({ timer });
  }

  render() {
    const { progress } = this.state;
    const { gratitude, onClose } = this.props;
    const mins = Math.floor(progress / 60);
    const secs = progress % 60;
    const width = Math.min(100, ((progress + 1) / 60) * 100);
    const isDone = (progress === 60);
    const styles = {
      header: { marginBottom: 24 },
      text: { marginBottom: 8 },
      progressBar: { marginTop: 32, marginBottom: 16 },
      buttons: { marginTop: 40 }
    };

    return (
      <div className='text-center'>
        <h1 style={styles.header}>
          Take a minute...
        </h1>

        <div style={styles.text}>
          to sit up straight, focus on your breath,
        </div>
        <div style={styles.text}>
          and think for a moment about why you're grateful.
        </div>
        <div style={styles.text}>
          Today, you are grateful for: <strong>{gratitude}</strong>
        </div>

        <div className='progress-bar-container'
          style={styles.progressBar}>
          <div className='progress-bar'
            style={{ width: `${width}%` }}>
          </div>
        </div>

        <h1>
          {mins}:{secs < 10 ? `0${secs}` : secs}
        </h1>

        <div className='clearfix'
          style={styles.buttons}>
          <button
            className={`btn-link pull-left ${isDone ? 'hidden' : ''}`}
            onClick={onClose}>
            Skip
          </button>
          <button
            className='btn-primary pull-right'
            disabled={!isDone}
            onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }
}

interface GratitudeItemProps {
  gratitude: IGratitude;
  opacity: number;
}

const GratitudeItem = ({ gratitude, opacity }: GratitudeItemProps) => {
  const { date, text } = gratitude;
  const [left, right] = moment(date).format('dddd, MMMM DD').split(', ');
  const style = { opacity };

  return (
    <div
      className='past-gratitude-item'
      style={style}>
      <div className='past-gratitude-date left'>{left}</div>
      <span>{text}</span>
      <div className='past-gratitude-date right'>{right}</div>
    </div>
  );
};

interface GratitudeState {
  gratitude: IGratitude;
  historical: IGratitude[];
  isEditing: boolean;
  isModalOpen: boolean;
}

class DailyGratitude extends React.Component<RouteComponentProps<{}>, GratitudeState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      gratitude: getDefaultGratitude(),
      historical: [],
      isEditing: true,
      isModalOpen: false
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchGratitudes()
      .then(gratitudes => {
        const current = getTodaysGratitude(gratitudes);

        return this.setState({
          gratitude: current || getDefaultGratitude(),
          historical: getRecentPastGratitudes(gratitudes, current),
          isEditing: !has(current, 'id')
        });
      })
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching gratitudes!', err);
      });
  }

  componentDidUpdate(prevProps: RouteComponentProps<{}>, prevState: GratitudeState) {
    const { isEditing } = this.state;
    const { isEditing: wasEditing } = prevState;

    if (!wasEditing && isEditing) {
      const el = (this.refs.gratitudeInput as HTMLInputElement);

      el.focus();
    }
  }

  saveGratitudeText() {
    const { gratitude } = this.state;
    const { id, text = '' } = gratitude;

    if (!text || !text.length) return resolve();

    return createOrUpdate(gratitude)
      .then(update => {
        return this.setState({
          gratitude: update,
          isEditing: false,
          isModalOpen: id ? false : true
        });
      })
      .catch(err => {
        console.log('Error saving gratitude!', err);
      });
  }

  handleKeyDown(e: any) {
    if (e.key === 'Enter') {
      const el = (this.refs.gratitudeInput as HTMLInputElement);

      el.blur(); // Input triggers save on blur
    }
  }

  handleTextChange(e: any) {
    const { gratitude } = this.state;
    const text = e.target.value;

    return this.setState({
      gratitude: { ...gratitude, text }
    });
  }

  resetTodaysGratitude() {
    const { id } = this.state.gratitude;

    if (!id) {
      return this.setState({
        isEditing: true,
        gratitude: { text: '' }
      });
    }

    return deleteGratitude(id)
      .then(res => {
        return this.setState({
          isEditing: true,
          gratitude: { text: '' }
        });
      })
      .catch(err => {
        console.log('Error deleting gratitude!', err);
      });
  }

  closeModal() {
    return this.setState({ isModalOpen: false });
  }

  getModalCustomStyles() {
    return {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      },
      content: {
        position: 'relative',
        width: '80%',
        minWidth: 400,
        maxWidth: 800,
        margin: '40px auto',
        padding: 24,
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto'
      }
    };
  }

  render() {
    const { history } = this.props;
    const {
      gratitude,
      historical = [],
      isEditing,
      isModalOpen
    } = this.state;
    const { text = '' } = gratitude;

    return (
      <div className='gratitude-container text-center'
        style={{ margin: '40px auto' }}>
        <Modal
          style={this.getModalCustomStyles()}
          isOpen={isModalOpen}>
          <GratitudeTimer
            gratitude={text}
            onClose={this.closeModal.bind(this)} />
        </Modal>

        <h3 className=''>
          Today, I am grateful for...
        </h3>

        <div style={{ minHeight: 112 }}>
          <div className={`${isEditing ? 'hidden' : ''}`}>
            <h2
              className={`gratitude-description ${isEditing ? 'hidden' : ''}`}
              onClick={() => this.setState({ isEditing: true })}>
              {text}
            </h2>
            <div className='clearfix'>
              <a className='btn-link -sm -primary'
                style={{ marginRight: 16 }}
                onClick={this.resetTodaysGratitude.bind(this)}>
                Reset
              </a>
              <a className='btn-link -sm -primary'
                style={{ marginLeft: 16 }}
                onClick={() => this.setState({ isEditing: true })}>
                Edit
              </a>
            </div>
          </div>

          <input
            type='text'
            name='gratitude'
            className={`input-default -wide text-center gratitude-input ${
              isEditing ? '' : 'hidden'
            }`}
            ref='gratitudeInput'
            placeholder='Type here'
            value={text}
            onBlur={this.saveGratitudeText.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            onChange={this.handleTextChange.bind(this)} />
        </div>

        <div className={`past-gratitudes-container ${
          historical && historical.length > 0 ? '' : 'hidden'
        }`}>
          <div className='past-gratitudes-label'>
            Other things I am grateful for...
          </div>
          {
            historical.slice(0, 5).map((item, index) => {
              const opacity =  1 - (index / 5);

              return (
                <GratitudeItem
                  key={index}
                  opacity={opacity}
                  gratitude={item} />
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default DailyGratitude;
