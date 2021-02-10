/**
 * App.js
 */

import React from "react";
import Home from "./pages/Home";
import { Route, Switch, Redirect } from "react-router-dom";
import Scoring from './pages/IndividualScoring';
import Finalize from './pages/PostGame';

export default function App() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path="/:page?" render={props => <Home {...props} />} />
      <Route path="/profile/individualscoring" component ={Scoring}/>
      <Route path="/profile/postgame" component={Finalize}/>
    </Switch>
  );
}
