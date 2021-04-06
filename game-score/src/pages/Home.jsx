/**
 * Home.jsx-Jonathon Lannon
 * Home React component responsible for the global tab menu, and allowing links and URL's to be made to be routed
 * NOTE: this tab bar uses Material UI
 */

 //import resources
import React from "react";  //basic React framework
import { Tabs, Tab, AppBar} from "@material-ui/core";  //Material UI for tab bar
import Cookies from 'js-cookie';

//All pages to be imported are to be used in the tabs
import HomeMenu from '../Menu';
import MyTemplates from './MyTemplates';
import Profile from './profilePages/Profile';
import PlayGame from './JoinGame';

/**
 * Home class: class for providing the Tab Bar component for navigating the main parts of GameScore
 * state @param
 * selectedTab: the number value for the currently selected tab
 * match @param: prop containing the history
 * params @param: equal to match
 * pages @param: equal to params for navigation purposes
 * indexToTabName: const map for interpreting which value should be applied when given one
 */
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
      selectedTab: indexToTabName[page]
    };
  }

  /**
   * tabNameToIndex: function for returning the string value of the page needed based on newValue
   * @param {*} newValue: value of the currently selected tab
   * @returns: a string that contains the string name of the tab
   */
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

  /**
   * tabHandler: event handler for clicking on tabs
   * @param {*} event: the event contained when clicking on the tab
   * @param {*} newValue: the new integer value of the selected tab
   */
  tabHandler=(event, newValue)=>{
    if(Cookies.get("username") === ""){
      this.props.history.push(`/home/login`);
      console.log("if hit");
    }
    else{
      console.log("newValue is " + newValue);
      console.log(this.tabNameToIndex(newValue));
      //push the correct push into History based on the newValue value
      this.props.history.push(`/${this.tabNameToIndex(newValue)}`);
      //update the state of the selected tab
      this.setState({
        selectedTab: newValue
      });
      console.log("else hit")
    }
    // console.log("newValue is " + newValue);
    // console.log(this.tabNameToIndex(newValue));
    // //push the correct push into History based on the newValue value
    // this.props.history.push(`/${this.tabNameToIndex(newValue)}`);
    // //update the state of the selected tab
    // this.setState({
    //   selectedTab: newValue
    // });
  }

  /**
   * render: React function for rendering the component
   * @returns elements that will make up the on-screen component
   */
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
      {this.state.selectedTab === 0 && <HomeMenu />}
      {this.state.selectedTab === 1 && <MyTemplates />}
      {this.state.selectedTab === 2 && <PlayGame history={this.props.history} location={this.props.location}/>}
      {this.state.selectedTab === 3 && <Profile history={this.props.history}/>}
    </>
    );
  }
}