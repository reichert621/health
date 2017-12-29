import React from 'react';
import { Link } from 'react-router-dom';
import CheckLists from './CheckLists';
import { fetchChecklists } from '../../helpers/checklist';
import './CheckList.less';

class CheckListsPage extends React.Component {
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
    const { limit = 40 } = this.props;

    return (
      <div className="default-container">
        <Link to="/">Back</Link>
        <h1>
          Checklists
        </h1>
        <Link to="/checklist/new">New Checklist</Link>
        <CheckLists
          checklists={checklists}
          limit={limit} />
      </div>
    );
  }
}

export default CheckListsPage;
