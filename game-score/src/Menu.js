/**
 * Menu.js-Jonathan Beels
 */

import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import GameRow from "./GameRow"
import TemplateRow from "./TemplateRow"
import BottomUI from "./BottomUI"
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';

function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
  return result ? result.pop() : ""
}

export default class Menu extends Component {

constructor(props) {
    super(props);
    this.state = { activeIndex: 0,
            data:{},
            loaded:"False",
            selectedTemplate:{accPos:0,rowPos:-1},
            usernameData: getCookieValue("username"),
            searchQuery: ""
          };
    };

  

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex,selectedTemplate:{accPos:index,rowPos:-1} })
  }


  componentDidMount() {
    fetch("/api/getHomePage")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result,
            loaded: "True"
          }
          );
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
      );
      this.setState({
        usernameData: getCookieValue("username")
      })
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

  render() {
    const { activeIndex } = this.state
    const { classes } = this.props;

    const searchStyle = {
      borderRadius: "5px"
    };

    return (
    <div>
      {/* Search Bar */}
      <Link to="/home/search">
        <input placeholder="Search Templates"  style={searchStyle}/>
      </Link>
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
        <TableContainer component={Paper}>
         <Table>
            {
                this.state.loaded === "True" &&
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
                                selected = {this.isSelected(0,key)}
                                play = {true}>
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

        {/* Recently Played */}
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Recently Played
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
        <TableContainer component={Paper}>
          <Table size="small">
                {
                this.state.loaded === "True" &&
                  <> 
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
                                favorited = {this.state.data["recentlyPlayed"][key].favorited}
                                selected = {this.isSelected(1,key)}
                                play = {true}>
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
                                favorited = {this.state.data["highestRated"][key].favorited}
                                selected = {this.isSelected(2,key)}
                                play = {true}>
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
                      <GameRow rowPos={key} accPos="3" 
                      pictureURL = {this.state.data["recommendedGames"][key].pictureURL} 
                      gameName = {this.state.data["recommendedGames"][key].gameName}
                      />
                    ))}
                  </>
                </div>
              }
          </Table>
        </TableContainer>
        </Accordion.Content>
      </Accordion>
    </div>
    )
  }
}
