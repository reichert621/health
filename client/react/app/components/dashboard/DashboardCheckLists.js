import React from 'react';
import { Link } from 'react-router-dom';
import CheckLists from '../checklist/CheckLists';
import { fetchChecklists } from '../../helpers/checklist';
import '../checklist/CheckList.less';

// TODO: DRY up (see CheckListsPage)
class DashboardCheckLists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklists: []
    };
  }

  componentDidMount() {
    return fetchChecklists()
      .then(checklists =>
        this.setState({ checklists }))
      .catch(err =>
        console.log('Error fetching checklists!', err));
  }

  render() {
    const { checklists } = this.state;
    const { limit = 5 } = this.props;

    return (
      <div>
        <h2>
          Checklists
        </h2>
        <Link to="/checklist/new">New Checklist</Link>
        <CheckLists
          checklists={checklists}
          limit={limit} />
        <Link to="/checklists">View All</Link>
      </div>
    );
  }
}

export default DashboardCheckLists;
