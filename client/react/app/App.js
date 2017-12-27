import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Home, Login, Profile, Library } from './components/home';
import { EntryContainer, NewEntry, EditEntry } from './components/entry';
import { ScoreCards, ScoreCard, NewScoreCard } from './components/scorecard';
import { CheckLists, CheckList, NewCheckList } from './components/checklist';
import { Reporting } from './components/reporting';
import './App.less';

ReactDOM.render((
  <Router>
    <div className="app">
      <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/new" component={NewEntry} />
      <Route path="/entry/:id" component={EntryContainer} />
      <Route path="/edit/:id" component={EditEntry} />
      <Route path="/@:username" component={Profile} />
      <Route path="/scorecards" component={ScoreCards} />
      <Route path="/scorecard/new" component={NewScoreCard} />
      <Route path="/scorecard/:id" component={ScoreCard} />
      <Route path="/checklists" component={CheckLists} />
      <Route path="/checklist/new" component={NewCheckList} />
      <Route path="/checklist/:id" component={CheckList} />
      <Route path="/reporting" component={Reporting} />
      <Route path="/components" component={Library} />
      </Switch>
    </div>
  </Router>
), document.getElementById('app'));
