/**
 * App.js
 */

import React from "react";
import Home from "./Home";
import { Route, Switch, Redirect } from "react-router-dom";

export default function App() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path="/:page?" render={props => <Home {...props} />} />
    </Switch>
  );
}
