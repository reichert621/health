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
import FriendFeed from './components/feed';
import {
  SelfActivationMethods,
  CognitiveDistortions,
  DailyImperatives,
  DailyGratitude,
  AntiProcrastinationSheet,
  PleasurePredicting,
  TripleColumnTechnique,
  ButRebuttal,
  SelfEndorsement,
  TicTocTechnique,
  MotivationWithoutCoercion,
  CannotLoseSystem,
  VisualizeSuccess,
  DailyActivitySchedule,
  DysfunctionalThoughts,
  LittleSteps,
  TestYourCannots,
  DisarmingTechnique,
  CountWhatCounts
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
            <Route path="/feed" component={FriendFeed} />
            <Route path="/tasks" component={TaskList} />
            <Route path="/self-activation" component={SelfActivationMethods} />
            <Route path="/daily-activity-schedule" component={DailyActivitySchedule} />
            <Route path="/anti-procrastination" component={AntiProcrastinationSheet} />
            <Route path="/dysfunctional-thoughts" component={DysfunctionalThoughts} />
            <Route path="/pleasure-predicting" component={PleasurePredicting} />
            <Route path="/triple-column" component={TripleColumnTechnique} />
            <Route path="/but-rebuttal" component={ButRebuttal} />
            <Route path="/self-endorsement" component={SelfEndorsement} />
            <Route path="/tic-toc" component={TicTocTechnique} />
            <Route path="/little-steps" component={LittleSteps} />
            <Route path="/motivation-without-coercion" component={MotivationWithoutCoercion} />
            <Route path="/test-your-cants" component={TestYourCannots} />
            <Route path="/cant-lose" component={CannotLoseSystem} />
            <Route path="/disarming-technique" component={DisarmingTechnique} />
            <Route path="/visualize-success" component={VisualizeSuccess} />
            <Route path="/count-what-counts" component={CountWhatCounts} />
            <Route path="/cognitive-distortions" component={CognitiveDistortions} />
            <Route path="/dos-and-donts" component={DailyImperatives} />
            <Route path="/gratitude" component={DailyGratitude} />
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
