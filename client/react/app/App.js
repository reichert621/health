import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import EntryContainer from './components/EntryContainer';
import NewEntry from './components/NewEntry';
import './App.css';

ReactDOM.render((
  <Router>
    <div className="app">
      <Route exact path="/" component={Home} />
      <Route path="/create" component={NewEntry} />
      <Route path="/entry/:id" component={EntryContainer} />
    </div>
  </Router>
), document.getElementById('app'));
