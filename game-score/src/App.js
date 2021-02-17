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
      <Route exact path="/:pages?" render={props => <Home {...props} />} />
      <Route path="/play/individualscoring" component ={Scoring}/>
      <Route path="/play/overview" component ={Overview}/>
      <Route path="/play/postgame" component={Finalize}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/mytemplates/conditioneditor" render = {props => <ConditionEditor {...props}/>} />
      <Route path="/mytemplates" component = {MyTemplates}/>
      <Route path="/mytemplates/templatecreator" component = {TemplateCreator}/>
      <Route path="/mytemplates/templateeditor" render = {props => <TemplateEditor {...props}/>} />
    </Switch>
  );
}
