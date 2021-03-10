/**
 * Home.jsx-Jonathon Lannon
 * Home React component responsible for the global tab menu, and allowing links and URL's to be made to be routed
 * NOTE: this tab bar uses Material UI
 */

 //import resources
import React from "react";  //basic React framework
import { Tabs, Tab, AppBar, Button } from "@material-ui/core";  //Material UI for tab bar
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

//All pages to be imported are to be used in the tabs
import HomeMenu from '../Menu';
import MyTemplates from './MyTemplates';
import Profile from './profilePages/Profile';
import PlayGame from './JoinGame';

/**
 * Home component: creates tab bar system
 * @param {*} props 
 */
const Home = props => {
  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const [loggedIn, setLoggedIn] = React.useState(Cookies.get("username"));

  //Map to route each tab index to it's appropriate path
  const tabNameToIndex = {
    0: "home",
    1: "mytemplates",
    2: "playgame",
    3: "profile"
  };

  //Map to route each path name to it's corresponding index
  const indexToTabName = {
    home: 0,
    mytemplates: 1,
    playgame: 2,
    profile: 3
  };

  //selectedTab represents the currently selected tab index
  //setSelectedTab is selectedTab's callback function
  //the React state is set to the appropriate value using the above mapping system
  const [selectedTab, setSelectedTab] = React.useState(indexToTabName[page]);

  //handleChange
  //newValue: value index of new tab to be selected by the user
  //URL is changed to the selected tab, according to newValue and the above mapping scheme
  const handleChange = (event, newValue) => {
    history.push(`/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
    setLoggedIn(Cookies.get("username"));
    console.log("the username cookie is...");
    console.log(Cookies.get("username"));
  };

  //return elements to be rendered from component
  //...in this case...the tab bar or "AppBar" as it's known in MaterialUI
  //65-68 return the appropriate React component needed to be displayed, based on the value of the selected tab
  return (
    <>
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleChange} centered>
          <Tab label="Home" />
          <Tab label="My Templates" />
          <Tab label="Play Game" />
          <Tab label="Profile" />
        </Tabs>
      </AppBar>
      {loggedIn
        ? null
        : <Link to = "/home/login"><Button>Click here to log in for full functionality</Button></Link>
      }
      {selectedTab === 0 && <HomeMenu />}
      {selectedTab === 1 && <MyTemplates />}
      {selectedTab === 2 && <PlayGame history={props.history} location={props.location}/>}
      {selectedTab === 3 && <Profile history={history}/>}
     
    </>
  );
};

export default Home;