// TODO: move this to `/experimental` directory (or something like that)
import React from 'react';
import { sample, keys, groupBy } from 'lodash';
import NavBar from '../navbar';
import { ScorecardSmall } from '../scorecard';
import { DailyGratitudeSmall } from '../self-activation';
import { fetchImperatives } from '../../helpers/imperatives';
import './v2.less';

const sections = {
  WELCOME: 'welcome',
  VALUES: 'values',
  HABITS: 'habits',
  GRATITUDE: 'gratitude',
  MOOD: 'mood'
};

const getClassNames = (obj) => {
  return keys(obj).filter(key => obj[key]).join(' ');
};

const DashboardSectionHeader = ({
  title,
  isActive,
  isComplete,
  onSelect
}) => {
  const className = getClassNames({
    'dashboard-section-header': true,
    'is-active': isActive,
    'is-complete': isComplete
  });

  return (
    <div
      className={className}
      onClick={onSelect}>
      <div className="header-text">{title}</div>
    </div>
  );
};

const DashboardNavBar = ({ selectedSection, onSelectSection }) => {
  return (
    <div className="clearfix">
      <DashboardSectionHeader
        title="Start"
        isActive={selectedSection === sections.WELCOME}
        isComplete={false}
        onSelect={() => onSelectSection(sections.WELCOME)} />

      <DashboardSectionHeader
        title="Values"
        isActive={selectedSection === sections.VALUES}
        isComplete={false}
        onSelect={() => onSelectSection(sections.VALUES)} />

      <DashboardSectionHeader
        title="Habits"
        isActive={selectedSection === sections.HABITS}
        isComplete={false}
        onSelect={() => onSelectSection(sections.HABITS)} />

      <DashboardSectionHeader
        title="Gratitude"
        isActive={selectedSection === sections.GRATITUDE}
        isComplete={false}
        onSelect={() => onSelectSection(sections.GRATITUDE)} />

      <DashboardSectionHeader
        title="Mood"
        isActive={selectedSection === sections.MOOD}
        isComplete={false}
        onSelect={() => onSelectSection(sections.MOOD)} />
    </div>
  );
};

const DashboardWelcome = ({ imperatives = [] }) => {
  const options = imperatives.map(i => i.description);
  const advice = sample(options);
  const styles = {
    container: {
      marginTop: 64,
      marginBottom: 64
    },
    header: {
      marginBottom: 32
    },
    content: {
      fontSize: 24,
      marginBottom: 8
    }
  };

  return (
    <div className="text-center">
      <div style={styles.container}>
        <h1 style={styles.header}>Hey there :)</h1>
        <div style={styles.content}>Remember &mdash;</div>
        <div style={styles.content}>
          {advice || 'Sit up straight with your shoulders back'}
        </div>
      </div>
      <button className="btn-primary">
        Get Started
      </button>
    </div>
  );
};

const ImperativeItem = ({ rank, item }) => {
  const { description } = item;

  return (
    <div className='task-item'
      style={{ paddingLeft: 16 }}>
      <span className='number-label pull-left'>{rank}.</span>
      <span className='imperative-description'>
        {description}
      </span>
    </div>
  );
};

const ImperativeCategory = ({ type, items = [] }) => {
  return (
    <div>
      <h4 className='category-label'
        style={{ marginLeft: 16 }}>
        {type}
      </h4>
      <ul className='task-sublist'>
        {
          items
            .sort((x, y) => x.id - y.id)
            .map((item, index) => {
              const { id: itemId } = item;
              const key = itemId || index;

              return (
                <ImperativeItem
                  key={key}
                  item={item}
                  rank={index + 1} />
              );
            })
        }
      </ul>
    </div>
  );
};

const DashboardValues = ({ imperatives = [] }) => {
  const { DO: dos, DONT: donts } = groupBy(imperatives, 'type');
  const styles = {
    container: {
      marginTop: 40,
      marginBottom: 40
    },
    header: {
      marginBottom: 32
    },
    content: {
      paddingBottom: 24,
      borderBottom: '1px solid #eaeaea'
    },
    button: {
      marginTop: 24
    },
    column: {
      width: '50%',
      minWidth: 400,
      paddingRight: 24
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Review your values</h1>
      <div style={styles.content}>
        Internalize these as much as possible!
      </div>

      <div className='clearfix'>
        <div className='pull-left' style={styles.column}>
          <ImperativeCategory
            type='Dos'
            items={dos} />
        </div>

        <div className='pull-left' style={styles.column}>
          <ImperativeCategory
            type={'Don\'ts'}
            items={donts} />
        </div>
      </div>

      <button className="btn-primary"
        style={styles.button}>
        Done
      </button>
    </div>
  );
};

const DashboardMood = () => {
  const styles = {
    container: {
      marginTop: 24
    },
    column: {
      width: '50%'
    },
    module: {
      border: '1px solid #eaeaea',
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 16,
      width: '96%'
    },
    tall: {
      height: 800
    },
    short: {
      height: 200
    }
  };

  return (
    <div style={styles.container}>
      <div className="clearfix">
        <div className="pull-left" style={styles.column}>
          <div style={{ ...styles.module, ...styles.tall }}>
            <h1>Daily Goals</h1>

            <div style={{ fontSize: 24, margin: '24px 0px 16px' }}>
              Exercise
            </div>
            <div style={{ marginBottom: 8 }}>
              Do 50 pushups
            </div>
            <div style={{ marginBottom: 8 }}>
              Go to the gym
            </div>

            <div style={{ fontSize: 24, margin: '24px 0px 16px' }}>
              Read
            </div>
            <div style={{ marginBottom: 8 }}>
              2 hours
            </div>
            <div style={{ marginBottom: 8 }}>
              1 hour
            </div>

            <div style={{ fontSize: 24, margin: '24px 0px 16px' }}>
              Work
            </div>
            <div style={{ marginBottom: 8 }}>
              Side project
            </div>
            <div style={{ marginBottom: 8 }}>
              Practice problems
            </div>
          </div>
        </div>

        <div className="pull-right" style={styles.column}>
          <div style={{ ...styles.module, ...styles.short }}>
            <h1>My Values</h1>

            <div style={{ marginBottom: 8 }}>
              Go outside and get some fresh air
            </div>
            <div style={{ marginBottom: 8 }}>
              Don't assume the worst
            </div>
          </div>
          <div style={{ ...styles.module, ...styles.short }}>
            <h1>I am grateful for...</h1>

            <div style={{}}>
              My friends and family
            </div>
          </div>
          <div style={{ ...styles.module, ...styles.short }}>
            <h1>My Mood</h1>

            <div style={{ marginBottom: 8 }}>
              12 points
            </div>
            <div style={{ marginBottom: 8 }}>
              88% happy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      selectedSection: sections.WELCOME,
      imperatives: []
    };
  }

  componentDidMount() {
    return fetchImperatives()
      .then(imperatives => {
        return this.setState({ imperatives });
      })
      .catch(err => console.log('Error!', err));
  }

  handleSectionSelected(selectedSection) {
    return this.setState({ selectedSection });
  }

  renderSelectedSection() {
    const {
      selectedSection,
      imperatives = []
    } = this.state;

    switch (selectedSection) {
      case sections.WELCOME:
        return <DashboardWelcome imperatives={imperatives} />;
      case sections.VALUES:
        return <DashboardValues imperatives={imperatives} />;
      case sections.HABITS:
        return <ScorecardSmall />;
      case sections.GRATITUDE:
        return <DailyGratitudeSmall />;
      case sections.MOOD:
        return <DashboardMood />;
      default:
        return <DashboardWelcome />;
    }
  }

  render() {
    const { selectedSection } = this.state;
    const { history } = this.props;

    return (
      <div style={{ backgroundColor: '#fefefe' }}>
        {/* <NavBar
          title="Dashboard"
          history={history} /> */}

        <div className="default-container">
          {/* <h1 style={{ marginBottom: 8 }}>Today</h1> */}

          {/* <div className="clearfix">
            <div className="pull-left">
              <h1 style={{ marginBottom: 8 }}>Today</h1>
              <h3 className="text-light">April 13, 2018</h3>
            </div>

            <div className="pull-right">
              <h2 className="text-light"
                style={{ marginTop: 56, marginRight: 16 }}>
                75% complete
              </h2>
            </div>
          </div> */}

          <DashboardNavBar
            selectedSection={selectedSection}
            onSelectSection={this.handleSectionSelected.bind(this)} />

          {this.renderSelectedSection()}
        </div>
      </div>
    );
  }
}

export default Dashboard;
