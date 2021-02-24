/**
 * App.js
 */

import React from "react";
import Home from "./pages/Home";
import { Route, Switch, Redirect } from "react-router-dom";
import Scoring from './pages/IndividualScoring';
import Finalize from './pages/PostGame';
import Overview from './pages/ScoringOverview';
import ConditionEditor from './pages/ConditionEditor';
import MyTemplates from './pages/MyTemplates';
import TemplateCreator from './pages/TemplateCreator';
import TemplateEditor from './pages/TemplateEditor';
import Profile from './pages/Profile';


export default function App() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path="/:page?" render={props => <Home {...props} />} />
      <Route path="/play/individualscoring" component ={Scoring}/>
      <Route path="/play/overview" component ={Overview}/>
      <Route path="/play/postgame" component={Finalize}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/mytemplates/conditioneditor" render = {props => <ConditionEditor {...props}/>} />
      <Route exact path="/mytemplates" component = {MyTemplates}/>
      <Route exact path="/mytemplates/creator" component = {TemplateCreator}/>
      <Route exact path="/mytemplates/editor" render = {props => <TemplateEditor {...props}/>} />
    </Switch>
  );
}
