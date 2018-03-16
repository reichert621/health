import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import {
  Home,
  Login,
  SignUp,
  SignUpComplete,
  Profile,
  About,
  Library
} from './components/home';
import { Dashboard } from './components/dashboard';
import { EntryContainer, UserEntryContainer } from './components/entry';
import { Scorecard } from './components/scorecard';
import { ChecklistContainer } from './components/checklist';
import TaskList from './components/tasks';
import { Reporting } from './components/reporting';
import {
  SelfActivationMethods,
  CognitiveDistortions,
  DailyImperatives
} from './components/self-activation';
// import 'normalize.css'; // TODO: figure out if necessary
import './App.less';

ReactDOM.render(
  (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/about" component={About} />
            <Route path="/signup-complete" component={SignUpComplete} />
            <Route path="/blog" component={Home} />
            <Route path="/@:username/entry/:id" component={UserEntryContainer} />
            <Route path="/@:username" component={Profile} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/tasks" component={TaskList} />
            <Route path="/self-activation" component={SelfActivationMethods} />
            <Route path="/cognitive-distortions" component={CognitiveDistortions} />
            <Route path="/dos-and-donts" component={DailyImperatives} />
            <Route path="/entry/:id" component={EntryContainer} />
            <Route path="/scorecard/:id" component={Scorecard} />
            <Route path="/checklist/:id" component={ChecklistContainer} />
            <Route path="/reporting" component={Reporting} />
            <Route path="/components" component={Library} />
          </Switch>
        </div>
      </Router>
    </Provider>
  ),
  document.getElementById('app')
);
