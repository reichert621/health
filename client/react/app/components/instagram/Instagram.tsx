import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import NavBar from '../navbar';
import {
  InstagramImage,
  fetchAuthUrl,
  fetchToken,
  fetchRecentImages
} from '../../helpers/instagram';
import './Instagram.less';

interface InstagramState {
  authUrl: string;
  images: InstagramImage[];
}

class Instagram extends React.Component<RouteComponentProps<{}>, InstagramState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      authUrl: '',
      images: []
    };
  }

  componentDidMount() {
    return fetchToken()
      .then(token => {
        if (token) {
          return this.fetchRecentImages();
        } else {
          return this.fetchAuthUrl();
        }
      })
      .catch(err => {
        console.log('Error fetching token!', err);
      });
  }

  fetchRecentImages() {
    return fetchRecentImages()
      .then(images => this.setState({ images }))
      .catch(err => {
        console.log('Error fetching images!', err);
      });
  }

  fetchAuthUrl() {
    return fetchAuthUrl()
      .then(url => this.setState({ authUrl: url }))
      .catch(err => {
        console.log('Error fetching url!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { authUrl, images = [] } = this.state;
    const urls = images.map(i => {
      return i.images.standard_resolution.url;
    });

    return (
      <div>
        <NavBar
          title='Instagram'
          linkTo='/'
          history={history} />

        <div className='default-container'>
          {
            authUrl &&
            <a href={authUrl}>
              <button className='btn-primary'>Authenticate</button>
            </a>
          }
          {
            urls.map((url, index) => {
              return (
                <img className='instagram-photo'
                  key={index}
                  src={url} />
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default Instagram;
