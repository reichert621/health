import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
import { Dashboard, Today } from './components/dashboard';
import { EntryContainer, UserEntryContainer } from './components/entry';
import { ScorecardContainer, ScorecardSample } from './components/scorecard';
import { ChecklistContainer, ChecklistSample } from './components/checklist';
import TaskList from './components/tasks';
import FriendFeed from './components/feed';
import {
  Reporting,
  TaskReporting,
  MoodReporting
} from './components/reporting';
import {
  AssessmentContainer,
  DepressionSample,
  AnxietySample,
  WellBeingSample
} from './components/assessment';
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
import {
  ActivitiesContainer,
  ReflectionContainer,
  AssessmentContainer as NewAssessmentContainer,
  WellBeingSample as ExperimentalAssessment,
  AnalyticsContainer
} from './components/experimental';
// import 'normalize.css'; // TODO: figure out if necessary
import './App.less';

ReactDOM.render(
  (
    <Provider store={store}>
      <Router>
        <div className='app'>
          <Switch>
            <Route exact path='/' component={ActivitiesContainer} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={SignUp} />
            <Route path='/example/checklist' component={ChecklistSample} />
            <Route path='/example/scorecard' component={ScorecardSample} />
            <Route path='/example/depression' component={DepressionSample} />
            <Route path='/example/anxiety' component={AnxietySample} />
            <Route path='/example/experimental' component={ExperimentalAssessment} />
            <Route path='/example/well-being' component={WellBeingSample} />
            <Route path='/signup-complete' component={SignUpComplete} />
            <Route path='/blog' component={Home} />
            <Route path='/activities' component={ActivitiesContainer} />
            <Route path='/reflect' component={ReflectionContainer} />
            <Route path='/@:username/entry/:id' component={UserEntryContainer} />
            <Route path='/@:username' component={Profile} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/today' component={Today} />
            <Route path='/feed' component={FriendFeed} />
            <Route path='/tasks' component={TaskList} />
            <Route path='/self-activation' component={SelfActivationMethods} />
            <Route path='/daily-activity-schedule' component={DailyActivitySchedule} />
            <Route path='/anti-procrastination' component={AntiProcrastinationSheet} />
            <Route path='/dysfunctional-thoughts' component={DysfunctionalThoughts} />
            <Route path='/pleasure-predicting' component={PleasurePredicting} />
            <Route path='/triple-column' component={TripleColumnTechnique} />
            <Route path='/but-rebuttal' component={ButRebuttal} />
            <Route path='/self-endorsement' component={SelfEndorsement} />
            <Route path='/tic-toc' component={TicTocTechnique} />
            <Route path='/little-steps' component={LittleSteps} />
            <Route path='/motivation-without-coercion' component={MotivationWithoutCoercion} />
            <Route path='/test-your-cants' component={TestYourCannots} />
            <Route path='/cant-lose' component={CannotLoseSystem} />
            <Route path='/disarming-technique' component={DisarmingTechnique} />
            <Route path='/visualize-success' component={VisualizeSuccess} />
            <Route path='/count-what-counts' component={CountWhatCounts} />
            <Route path='/cognitive-distortions' component={CognitiveDistortions} />
            <Route path='/dos-and-donts' component={DailyImperatives} />
            <Route path='/gratitude' component={DailyGratitude} />
            <Route path='/entry/:id' component={EntryContainer} />
            <Route path='/scorecard/:id' component={ScorecardContainer} />
            <Route path='/checklist/:id' component={ChecklistContainer} />
            <Route path='/assessment/:id' component={NewAssessmentContainer} />
            <Route path='/reporting/tasks' component={TaskReporting} />
            <Route path='/reporting/moods' component={MoodReporting} />
            <Route path='/reporting' component={Reporting} />
            <Route path='/analytics' component={AnalyticsContainer} />
            <Route path='/components' component={Library} />
          </Switch>
        </div>
      </Router>
    </Provider>
  ),
  document.getElementById('app')
);
