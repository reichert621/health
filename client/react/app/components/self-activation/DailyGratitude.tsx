import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
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
}

class DailyGratitude extends React.Component<RouteComponentProps<{}>, GratitudeState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      gratitude: getDefaultGratitude(),
      historical: [],
      isEditing: true
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
        return this.setState({ gratitude: update, isEditing: false });
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

  render() {
    const { history } = this.props;
    const {
      gratitude,
      historical = [],
      isEditing,
    } = this.state;
    const { text = '' } = gratitude;

    return (
      <div>
        <NavBar
          title='Gratitude'
          linkTo='/'
          history={history} />

        <div className='default-container gratitude-container text-center'>
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
      </div>
    );
  }
}

export default DailyGratitude;
