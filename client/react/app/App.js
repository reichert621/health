import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import EntryContainer from './components/EntryContainer';
import NewEntry from './components/NewEntry';
import EditEntry from './components/EditEntry';
import Profile from './components/Profile';
import ScoreCard from './components/ScoreCard';
import CheckList from './components/CheckList';
import Reporting from './components/Reporting';
import Library from './components/Library';
import './App.less';

ReactDOM.render((
  <Router>
    <div className="app">
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/new" component={NewEntry} />
      <Route path="/entry/:id" component={EntryContainer} />
      <Route path="/edit/:id" component={EditEntry} />
      <Route path="/@:username" component={Profile} />
      <Route path="/scorecard/:id" component={ScoreCard} />
      <Route path="/checklist/:id" component={CheckList} />
      <Route path="/reporting" component={Reporting} />
      <Route path="/components" component={Library} />
    </div>
  </Router>
), document.getElementById('app'));
