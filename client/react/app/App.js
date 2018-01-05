import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Home, Login, Profile, Library } from './components/home';
import { Dashboard } from './components/dashboard';
import { EntryContainer, NewEntry, EditEntry } from './components/entry';
import { ScoreCardsPage, ScoreCard, NewScoreCard } from './components/scorecard';
import { CheckListsPage, CheckList, NewCheckList } from './components/checklist';
import TaskList from './components/tasks';
import { Reporting } from './components/reporting';
// import 'normalize.css'; // TODO: figure out if necessary
import './App.less';

ReactDOM.render(
  (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tasks" component={TaskList} />
          <Route path="/new" component={NewEntry} />
          <Route path="/entry/:id" component={EntryContainer} />
          <Route path="/edit/:id" component={EditEntry} />
          <Route path="/@:username" component={Profile} />
          <Route path="/scorecards" component={ScoreCardsPage} />
          <Route path="/scorecard/new" component={NewScoreCard} />
          <Route path="/scorecard/:id" component={ScoreCard} />
          <Route path="/checklists" component={CheckListsPage} />
          <Route path="/checklist/new" component={NewCheckList} />
          <Route path="/checklist/:id" component={CheckList} />
          <Route path="/reporting" component={Reporting} />
          <Route path="/components" component={Library} />
        </Switch>
      </div>
    </Router>
  ),
  document.getElementById('app')
);
