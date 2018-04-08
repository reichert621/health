import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as moment from 'moment';
import { keys } from 'lodash';
import NavBar from '../navbar';
import { IFeedActivity, ActivityType, fetchFeed } from '../../helpers/feed';
import './Feed.less';

const FeedActivityItem = ({ activity }: { activity: IFeedActivity }) => {
  const { username, type, count } = activity;

  switch (type) {
    case ActivityType.CHECKLIST:
      return (
        <li>
          <Link to={`/@${username}`}>{username} </Link>
          <span>checked in.</span>
        </li>
      );
    case ActivityType.SCORECARD:
      return (
        <li>
          <Link to={`/@${username}`}>{username} </Link>
          <span>completed </span>
          <span className='text-blue'>{count} tasks!</span>
        </li>
      );
    default:
      return null;
  }
};

interface FeedDateProps {
  date: string;
  activities: IFeedActivity[];
}

const FeedDate = ({ date, activities }: FeedDateProps) => {
  return (
    <div className='feed-date-container'>
      <h4 className='text-light'>
        {moment(date).format('dddd MMMM DD, YYYY')}
      </h4>
      <ul>
        {
          activities.map((activity, index) => {
            return (
              <FeedActivityItem
                key={index}
                activity={activity} />
            );
          })
        }
      </ul>
    </div>
  );
};

interface FeedState {
  dates: string[];
  activitiesByDate: {
    [date: string]: IFeedActivity[]
  };
}

class FriendFeed extends React.Component<RouteComponentProps<{}>, FeedState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      dates: [],
      activitiesByDate: {}
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchFeed()
      .then(activitiesByDate => {
        const dates = keys(activitiesByDate).sort().reverse();

        return this.setState({
          dates,
          activitiesByDate
        });
      })
      .catch(err => {
        console.log('Error fetching feed!', err);

        return history.push('/login');
      });
  }

  render() {
    const { history } = this.props;
    const { dates = [], activitiesByDate = {} } = this.state;

    return (
      <div>
        <NavBar
          title='Feed'
          linkTo='/'
          history={history} />

        <div className='default-container'>
          {
            dates.map((date, key) => {
              const activities = activitiesByDate[date] || [];

              return (
                <FeedDate
                  key={key}
                  date={date}
                  activities={activities} />
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default FriendFeed;
