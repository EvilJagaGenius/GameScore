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
import Login from './pages/loginPages/Login';
import ForgetPassword from './pages/loginPages/ForgetPassword';
import CreateAccount from './pages/loginPages/CreateAccount';
import ResetPasswordUsername from './pages/loginPages/ResetPassword';
import ResetUsernameEmail from './pages/loginPages/ForgetUsername';
import InviteFriends from './pages/InviteFriends';
import JoinGame from './pages/JoinGame';

export default function App() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path="/:page?" render={props => <Home {...props} />} />
      <Route path="/play/individualscoring" component ={Scoring}/>
      <Route path="/play/overview" component ={Overview}/>
      <Route path="/play/postgame" component={Finalize}/>
      <Route path="/play/invite" component={InviteFriends}/>
      <Route path="/play/" component={JoinGame}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/mytemplates/conditioneditor" render = {props => <ConditionEditor {...props}/>} />
      <Route path="/mytemplates" component = {MyTemplates}/>
      <Route path="/mytemplates/templatecreator" component = {TemplateCreator}/>
      <Route path="/mytemplates/templateeditor" render = {props => <TemplateEditor {...props}/>} />
      <Route path="/home/login" component ={Login}/>
      <Route path="/login/forgetpassword" component={ForgetPassword}/>
      <Route path="/login/createaccount" component={CreateAccount}/>
      <Route path="/login/resetpassword" component={ResetPasswordUsername}/>
      <Route path="/login/resetusername" component={ResetUsernameEmail}/>
    </Switch>
  );
}
