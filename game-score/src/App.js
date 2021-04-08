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
import Profile from './pages/profilePages/Profile';
import Login from './pages/loginPages/Login';
import ForgetPassword from './pages/loginPages/ForgetPassword';
import CreateAccount from './pages/loginPages/CreateAccount';
import ResetPasswordUsername from './pages/loginPages/ResetPassword';
import ResetUsernameEmail from './pages/loginPages/ForgetUsername';
import EditAccount from './pages/profilePages/EditAccount';
import EditAvatar from './pages/profilePages/EditAvatar';
import InviteFriends from './pages/InviteFriends';
import SearchResults from './pages/SearchResults';
import RejoinGame from './pages/RejoinGame';


export default function App() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path="/:page?" 
        render={(props) => 
        <>
          <RejoinGame />
          <Home {...props} />
        </> 
        }>
      </Route>
      <Route path="/profile/editaccount" 
        render={(props) => 
        <>
          <RejoinGame />
          <Home {...props}></Home>
          <EditAccount {...props}></EditAccount>
        </> 
      }>
      </Route>
      <Route path="/profile/editavatar" 
        render={(props) => 
        <>
          <RejoinGame />
          <Home {...props}></Home>
          <EditAvatar {...props}></EditAvatar>
        </> 
      }>
      </Route>
      <Route path="/play/individualscoring" 
        render={(props) => 
        <>
          <Scoring {...props}></Scoring>
        </> 
      }>
      </Route>
      <Route path="/play/overview" 
        render={(props) => 
        <>
          <Overview {...props}></Overview>
        </> 
      }>
      </Route>
      <Route path="/play/postgame" 
        render={(props) => 
        <>
          <RejoinGame />
          <Finalize {...props}></Finalize>
        </> 
      }>
      </Route>
      <Route path="/play/invite" 
        render={(props) => 
        <>
          <InviteFriends {...props}></InviteFriends>
        </> 
      }>
      </Route>
      <Route path="/profile" 
        render={(props) => 
        <>
          <RejoinGame />
          <Profile {...props}></Profile>
        </> 
      }>
      </Route>
      <Route path="/mytemplates/conditioneditor" 
        render={(props) => 
        <>
          <RejoinGame />
          <ConditionEditor {...props}></ConditionEditor>
        </> 
      }>
      </Route>
      <Route path="/mytemplates/creator"
        render={(props) => 
        <>
          <RejoinGame />
          <TemplateCreator {...props}></TemplateCreator>
        </> 
      }>
      </Route>
      <Route path="/mytemplates/editor"
        render={(props) => 
        <>
          <RejoinGame />
          <TemplateEditor {...props}></TemplateEditor>
        </> 
      }>
      </Route>
      <Route path="/mytemplates"
        render={(props) => 
        <>
          <RejoinGame />
          <MyTemplates {...props}></MyTemplates>
        </> 
      }>
      </Route>
      <Route path="/home/login"
        render={(props) => 
        <>
          <Home {...props}></Home>
          <Login {...props}></Login>
        </> 
      }>
      </Route>
      <Route path="/home/search"
        render={(props) => 
        <>
          <RejoinGame />
          <SearchResults {...props}></SearchResults>
        </> 
      }>
      </Route>
      <Route path="/login/forgetpassword"
        render={(props) => 
        <>
          <Home {...props}></Home>
          <ForgetPassword {...props}></ForgetPassword>
        </> 
      }>
      </Route>
      <Route path="/login/createaccount"
        render={(props) => 
        <>
          <Home {...props}></Home>
          <CreateAccount {...props}></CreateAccount>
        </> 
      }>
      </Route>
      <Route path="/login/resetpassword"
        render={(props) => 
        <>
          <Home {...props}></Home>
          <ResetPasswordUsername {...props}></ResetPasswordUsername>
        </> 
      }>
      </Route>
      <Route path="/login/resetusername"
        render={(props) => 
        <>
          <Home {...props}></Home>
          <ResetUsernameEmail {...props}></ResetUsernameEmail>
        </> 
      }>
      </Route>

      
    </Switch>
  );
}
