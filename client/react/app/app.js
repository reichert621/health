import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import EntryContainer from './components/EntryContainer';
import './app.css';

ReactDOM.render((
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/entry/:id" component={EntryContainer} />
    </div>
  </Router>
), document.getElementById('app'));
