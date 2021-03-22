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

export default class Home extends React.Component{
  constructor(props){
    super();
    const {match} = props;
    const {params} = match;
    const {page} = params;
    const indexToTabName = {
      home: 0,
      mytemplates: 1,
      playgame: 2,
      profile: 3
    };
    this.state = {
      loggedIn: Cookies.get("username"),
      selectedTab: indexToTabName[page]
    };
  }
  tabNameToIndex(newValue){
    switch (newValue) {
      case 0:
        return "home";
      case 1:
        return "mytemplates";
      case 2:
        return "playgame";
      case 3:
        return "profile";
      default:
        break;
    }
  }
  tabHandler=(event, newValue)=>{
    console.log("newValue is ");
    console.log(newValue);
    console.log(this.tabNameToIndex(newValue));

    if(Cookies.get("username") != null)
    {
       this.props.history.push(`/${this.tabNameToIndex(newValue)}`);
    }
    else
    {
       this.props.history.push(`/home/login`);
    }
    this.setState({
      selectedTab: newValue,
      loggedIn: Cookies.get("username")
    });
    console.log("the username cookie is...");
    console.log(Cookies.get("username"));
  }
  render(){
    return(
    <>
      <AppBar position="static">
        <Tabs value={this.state.selectedTab} onChange={this.tabHandler} centered>
          <Tab label="Home" />
          <Tab label="My Templates" />
          <Tab label="Join Game" />
          <Tab label="Profile" />
        </Tabs>
      </AppBar>
      {this.state.loggedIn
        ? null
        : <Link to = "/home/login"><Button>Click here to log in for full functionality</Button></Link>
      }
      {this.state.selectedTab === 0 && <HomeMenu />}
      {this.state.selectedTab === 1 && <MyTemplates />}
      {this.state.selectedTab === 2 && <PlayGame history={this.props.history} location={this.props.location}/>}
      {this.state.selectedTab === 3 && <Profile history={this.history}/>}
    </>
    );
  }
}