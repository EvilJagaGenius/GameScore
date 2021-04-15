/**
 * Menu.jsx-Jonathan Beels/Jonathon Lannon
 */

import React, { Component } from 'react'
import { Accordion, AccordionPanel, Icon } from 'semantic-ui-react'
import GameRow from "./GameRow"
import TemplateRow from "./TemplateRow"
import UserRow from "./UserRow"
import BottomUI from "./BottomUI"
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Cookies from 'js-cookie';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import {Button} from "@material-ui/core";

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0,
            data:{},
            loaded:"False",
            selectedTemplate:{accPos:0,rowPos:-1},
            usernameData: Cookies.get("username"),
            searchQuery: "",
            searching: "false",
            filtered: {},
            searchData: {},
            reportData: {},
            admin: {},
            isLoggedIn: true
    };
    this.callAPI = this.callAPI.bind(this);
    this.gameSearchButton = this.gameSearchButton.bind(this);
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex,selectedTemplate:{accPos:index,rowPos:-1} })
  }

  componentDidMount() {
    Promise.all([
      fetch("/api/getHomePage").then(res => res.json()),
      fetch("/api/search/templates").then(res => res.json()),
      fetch("/api/listReports").then(res => res.json())
    ]).then(([homeResponse, searchResponse, reportResponse]) => {
      this.setState({
        data: homeResponse,
        searchData: searchResponse.templates,
        reportData: reportResponse,
        loaded: "True"
      });

      console.log(homeResponse);
    });
    if(Cookies.get("username")){
      console.log("logged in")
      this.setState({
        isLoggedIn: true
      })
    }
    else{
      console.log("else hit agian")
      this.setState({
        isLoggedIn: false
      })
    }
    console.log(Cookies.get("username"))
  }

  
  callAPI() {
    Promise.all([
      fetch("/api/getHomePage").then(res => res.json()),
      fetch("/api/search/templates").then(res => res.json()),
      fetch("/api/listReports").then(res => res.json())
    ]).then(([homeResponse, searchResponse, reportResponse]) => {
      this.setState({
        data: homeResponse,
        searchData: searchResponse.templates,
        reportData: reportResponse,
        loaded: "True"
      });

      console.log(reportResponse);
    });
      
      this.setState({
        usernameData: Cookies.get("username")
      });
  }

  selectTemplate(newAccPos,newRowPos)
  {
    this.setState({
      selectedTemplate:{accPos:newAccPos,rowPos:newRowPos}
    })

    console.log(this.state.selectedTemplate.accPos)
    console.log(this.state.selectedTemplate.rowPos)
  }

  isSelected(checkAccPos,checkRowPos)
  {
    if(checkAccPos === this.state.selectedTemplate.accPos
      && checkRowPos === this.state.selectedTemplate.rowPos)
    {
      return true
    }
    else
    {
      return false
    }
  }

  handleChange = (e) => {
    this.setState({
        searchQuery: e.target.value,
        searching: "true"
    },this.templateSearch)

  }

  templateSearch = () => {
    //hold original list of results
    let currentList = {};
    //hold filtered list
    let newList = {};

    //if the search bar isn't empty
    if (this.state.searchQuery !== "" && this.state.loaded === "True") {
      currentList = this.state.searchData;
      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(template => {
        // change current item to lowercase
        const tnlc = template.templateName.toLowerCase();
        const gnlc = template.gameName.toLowerCase();
        const unlc = template.userName.toLowerCase();

        // change search term to lowercase
        const filter = this.state.searchQuery.toLowerCase();

        //Determine if the query is in the template's name, the template's game's name, or the template's creator's name
        if (tnlc.includes(filter)) {
          return tnlc.includes(filter);

        } else if (gnlc.includes(filter)) {
          return gnlc.includes(filter);
        } else {
          return unlc.includes(filter);
        }
      });

    }

    if (this.state.searchQuery === "") {
      this.setState({
        searching: "false"
      })
    }

    console.log(newList);

    this.setState({
      filtered: newList
    })
  }
  
  gameSearchButton(gameName) {
    console.log("Search button clicked");
    this.setState({
      searching: "true",
      searchQuery: gameName
    }, this.templateSearch)
  }

  render() {
    const { activeIndex } = this.state;
    return (
    <div>
      <div style={{textAlign:"center",display:"inlineBlock",marginTop:15,marginBottom:5}} align="center" textAlign= "center">
        {/*Login Button*/}
        {this.state.isLoggedIn
          ? null
          : <Link to = "/home/login"><Button variant="outlined" color="primary">Click here to log in for full functionality</Button></Link>
        }
      </div>
      {/* Search Bar */}
      <TextField id="outlined-basic" label="Search All Templates" variant="outlined" value={this.state.searchQuery} onChange={this.handleChange} style={{width:"90%",marginLeft:"5%", marginTop:"1%",marginBottom:"1%"}}/>

      {/* Wipe out accordians if the user is actively searching */}
      { this.state.searching === "false" &&
      <>
      {/* The accordian menu */}
      <Accordion fluid styled>

        {/* Favorited Templates accordian */}
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Favorited Templates
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
        {/*Start conditional rendering*/}
        {this.state.isLoggedIn
        ? <TableContainer component={Paper}>
        <Table>
               {
                 this.state.loaded === "True" && Cookies.get("username") != null &&
                   <> 
                     {Object.keys(this.state.data.favoritedTemplates).map(key => (
                         <>
                           <TableRow onClick={()=>this.selectTemplate(0,key)}>
                             <TemplateRow 
                             pictureURL = {this.state.data["favoritedTemplates"][key].pictureURL} 
                             templateName = {this.state.data["favoritedTemplates"][key].templateName}
                             numRatings = {this.state.data["favoritedTemplates"][key].numRatings}
                             averageRating = {this.state.data["favoritedTemplates"][key].averageRating}
                             />
                           </TableRow>
                             {
                             this.isSelected(0,key) === true &&
                             <>
                               <BottomUI
                                 templateName = {this.state.data["favoritedTemplates"][key].templateName}
                                 templateID = {this.state.data["favoritedTemplates"][key].templateID}
                                 gameID = {this.state.data["favoritedTemplates"][key].gameID}
                                 favorited = {this.state.data["favoritedTemplates"][key].favorited}
                                 userID = {this.state.data["favoritedTemplates"][key].authorUserID}
                                 authorName = {this.state.data["favoritedTemplates"][key].authorUsername}
                                 selected = {this.isSelected(0,key)}
                                 play = {true}
                                 rep = {true}
                                 update = {this.callAPI}
                                 rate= {true}>
                                 </BottomUI>
                             </>
                           }
                       </>
                     ))}
                   </>
               }
           </Table>
         </TableContainer>
        : <Typography>Log in for full functionality.</Typography>
        }
        {/*End conditional rendering*/}
        </Accordion.Content>
        

        {/* Recently Played */}
        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
          <Icon name='dropdown' />
          Recently Played
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
        
        {/*Start conditional rendering*/}
        {this.state.isLoggedIn
        ? 
        <TableContainer component={Paper}>
          <Table size="small">
                {
                this.state.loaded === "True" &&
                  <> 
                    {console.log(this.state.loaded)}
                    {Object.keys(this.state.data.recentlyPlayed).map(key => (
                        <>
                          <TableRow onClick={()=>this.selectTemplate(1,key)}>
                            <TemplateRow
                            pictureURL = {this.state.data["recentlyPlayed"][key].pictureURL} 
                            templateName = {this.state.data["recentlyPlayed"][key].templateName}
                            numRatings = {this.state.data["recentlyPlayed"][key].numRatings}
                            averageRating = {this.state.data["recentlyPlayed"][key].averageRating}
                            templateID = {this.state.data["recentlyPlayed"][key].templateID}
                            gameID = {this.state.data["recentlyPlayed"][key].gameID}
                            selected = {this.isSelected(1,key)}
                            />
                          </TableRow>
                            {
                            this.isSelected(1,key) === true &&
                            <>
                              <BottomUI
                                templateName = {this.state.data["recentlyPlayed"][key].templateName}
                                templateID = {this.state.data["recentlyPlayed"][key].templateID}
                                gameID = {this.state.data["recentlyPlayed"][key].gameID}
                                userID = {this.state.data["recentlyPlayed"][key].authorUserID}
                                userName = {this.state.data["recentlyPlayed"][key].authorUsername}
                                rep = {true}
                                prevRating = {this.state.data["recentlyPlayed"][key].prevRating}
                                favorited = {this.state.data["recentlyPlayed"][key].favorited}
                                selected = {this.isSelected(1,key)}
                                play = {true}
                                update = {this.callAPI}
                                rate= {true}>
                                </BottomUI>
                            </>
                          }
                      </>
                    ))}
                  </>

              }
          </Table>
          </TableContainer>
        : <Typography>Log in for full functionality.</Typography>
        }
        {/*End conditional rendering*/}
        </Accordion.Content>

        {/* Highest Rated Templates accordian */}
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Highest Rated Templates
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
         <TableContainer component={Paper}>
          <Table size="small">
               {
                this.state.loaded === "True" &&
                  <> 
                    {Object.keys(this.state.data.highestRated).map(key => (
                        <>
                          <TableRow onClick={()=>this.selectTemplate(2,key)}>
                            <TemplateRow
                            pictureURL = {this.state.data["highestRated"][key].pictureURL} 
                            templateName = {this.state.data["highestRated"][key].templateName}
                            numRatings = {this.state.data["highestRated"][key].numRatings}
                            averageRating = {this.state.data["highestRated"][key].averageRating}
                            templateID = {this.state.data["highestRated"][key].templateID}
                            gameID = {this.state.data["highestRated"][key].gameID}
                            selected = {this.isSelected(2,key)}
                            />
                          </TableRow>
                          {
                            this.isSelected(2,key) === true &&
                            <>
                              <BottomUI
                                templateName = {this.state.data["highestRated"][key].templateName}
                                templateID = {this.state.data["highestRated"][key].templateID}
                                gameID = {this.state.data["highestRated"][key].gameID}
                                userID = {this.state.data["highestRated"][key].authorUserID}
                                userName = {this.state.data["highestRated"][key].authorUsername}
                                rep = {true}
                                prevRating = {this.state.data["highestRated"][key].prevRating}
                                favorited = {this.state.data["highestRated"][key].favorited}
                                selected = {this.isSelected(2,key)}
                                play = {true}
                                update = {this.callAPI}
                                rate= {true}>
                              </BottomUI>
                            </>
                          }
                      </>
                    ))}
                  </>

              }
          </Table>
        </TableContainer>
        </Accordion.Content>

        {/* Recommended Games accordian */}
        <Accordion.Title
          active={activeIndex === 3}
          index={3}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Recommended Games
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
         <TableContainer component={Paper}>
          <Table size="small">
                {/*Table displaying the dynamic data for Favorited Templates*/}
                {
                this.state.loaded === "True" &&
                <div className="RecommendedGames">
                  <> 
                    {/* Iterate through favorited templates and render the data in a tabular format */}
                    {Object.keys(this.state.data.recommendedGames).map(key => (
                      <>
                      <TableRow onClick={()=>this.selectTemplate(3,key)}>
                        <GameRow rowPos={key} accPos="3" 
                        pictureURL = {this.state.data["recommendedGames"][key].pictureURL} 
                        gameName = {this.state.data["recommendedGames"][key].gameName}
                        selected = {this.isSelected(3,key)}
                        />
                      </TableRow>
                        {this.isSelected(3,key) === true &&
                          <>
                          <BottomUI
                            gameURL = {"https://www.boardgamegeek.com" + this.state.data["recommendedGames"][key].gameURL}
                            gameName = {this.state.data["recommendedGames"][key].gameName}
                            gameBottomUI = {true}
                            searchFunction = {this.gameSearchButton}
                            selected = {this.isSelected(3,key)}
                            >
                          </BottomUI>
                      </>
                        }
                      </>
                    ))}
                  </>
                </div>
              }
          </Table>
        </TableContainer>
            {
              this.state.loaded === "True" && Cookies.get("username") == null &&
                <Typography style={{marginLeft:20}}>Login for full functionality.</Typography>
            } 
        </Accordion.Content>
        
        {/* Displays only when user is admin */}
        { this.state.reportData.admin === 1 &&
        <>

          {/* Reported Templates */}
          <Accordion.Title
            active={activeIndex === 4}
            index={4}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            Reported Templates
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 4}>
            <TableContainer component={Paper}>
              <Table size="small">
                {/* Table displays reported templates */}
                { this.state.loaded === "True" &&
                  <div className="ReportedTemplates">
                    <>
                      {/* Iterated through the list of reported templates */}
                      {Object.keys(this.state.reportData.templates).map(key => (
                        <>
                        <TableRow onClick={()=>this.selectTemplate(4, key)}>
                          <TemplateRow 
                            pictureURL = {this.state.reportData["templates"][key].pictureURL}
                            templateName = {this.state.reportData["templates"][key].templateName}
                            averageRating = {null}
                            numRatings = {null}
                          />
                        </TableRow>
                        {
                            this.isSelected(4,key) === true &&
                            <>
                              <BottomUI
                                templateID = {this.state.reportData["templates"][key].templateID}
                                userID = {this.state.reportData["templates"][key].userID}
                                reportID = {this.state.reportData["templates"][key].reportID}
                                reason = {this.state.reportData["templates"][key].reason}
                                gameID = {this.state.reportData["templates"][key].gameID}
                                selected = {this.isSelected(4,key)}
                                review = {true}
                                judge = {true}
                                update = {this.callAPI}>
                              </BottomUI>
                            </>
                          }
                        </>
                      ))}
                    </>
                  </div>
                }
              </Table>
            </TableContainer>
          </Accordion.Content> 

          {/* Reported Users */}
          <Accordion.Title
            active={activeIndex === 5}
            index={5}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            Reported Users
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 5}>
            <TableContainer component={Paper}>
              <Table size="small">
                {/* Table displays reports users */}
                {this.state.loaded === "True" &&
                  <div className="ReportedUsers">
                    <>
                      {/* Iterated through the list of reported users */}
                      {Object.keys(this.state.reportData.users).map(key => (
                        <>
                        <TableRow onClick={()=>this.selectTemplate(5, key)}>
                          <UserRow
                            avatarID = {this.state.reportData["users"][key].avatarID}
                            userName = {this.state.reportData["users"][key].username}
                          />
                        </TableRow>
                        {
                          this.isSelected(5,key) === true &&
                          <>
                            <BottomUI
                              templateID = {this.state.reportData["users"][key].templateID}
                              userID = {this.state.reportData["users"][key].userID}
                              reportID = {this.state.reportData["users"][key].reportID}
                              reason = {this.state.reportData["users"][key].reason}
                              selected = {this.isSelected(5,key)}
                              judge = {true}
                              update = {this.callAPI}>
                            </BottomUI>
                          </>
                        }
                        </>
                      ))}
                    </>
                  </div>
                }
              </Table>
            </TableContainer>
          </Accordion.Content>
        </>
        }
      </Accordion> 
      </>
      }

      {/* Render Search results */}
      {this.state.loaded === "True" &&
      <>
        <TableContainer component={Paper}>
          <Table>
            {Object.keys(this.state.filtered).map(key => (
              <>
                <TableRow onClick={()=>this.selectTemplate(key)}>
                  <TemplateRow 
                    pictureURL = {this.state.filtered[key].pictureURL} 
                    templateName = {this.state.filtered[key].templateName}
                    numRatings = {this.state.filtered[key].numRatings}
                    averageRating = {this.state.filtered[key].averageRating}
                  />
                </TableRow>
                {this.isSelected(key) === true &&
                  <>
                  <BottomUI
                    templateName = {this.state.filtered[key].templateName}
                    templateID = {this.state.filtered[key].templateID}
                    gameID = {this.state.filtered[key].gameID}
                    favorited = {this.state.filtered[key].favorited}
                    userID = {this.state.filtered[key].userID}
                    userName = {this.state.filtered[key].userName}
                    selected = {this.isSelected(key)}
                    play = {true}
                    rep = {true}
                    update = {this.callAPI}
                    rate= {true}>
                    </BottomUI>
                  </>
                }
              </>
            ))}
          </Table>
        </TableContainer>
      </>
      }
    </div>
    )
  }
}
