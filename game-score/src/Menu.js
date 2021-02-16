/**
 * Menu.js-Jonathan Beels
 */

import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import GameRow from "./GameRow"
import TemplateRow from "./TemplateRow"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




export default class Menu extends Component {
  state = { activeIndex: 0,
            data:{},
            loaded:"False",
            selectedTemplate:{accPos:0,rowPos:0}
          }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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
      )
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
    if(checkAccPos == this.state.selectedTemplate.accPos
      && checkRowPos == this.state.selectedTemplate.rowPos)
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

    return (
      //The accordian menu
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
          <Table size="small">
                {/*Table displaying the dynamic data for Favorited Templates*/}
                {
                this.state.loaded == "True" &&
                <div className="FavoritedData">
                  <> 
                    {/* Iterate through favorited templates and render the data in a tabular format */}
                    {Object.keys(this.state.data.favoritedTemplates).map(key => (
                      <div onClick={()=>this.selectTemplate(0,key)}>
                        <TemplateRow rowPos={key} accPos="0" 
                        pictureURL = {this.state.data["favoritedTemplates"][key].pictureURL} 
                        templateName = {this.state.data["favoritedTemplates"][key].templateName}
                        numRatings = {this.state.data["favoritedTemplates"][key].numRatings}
                        averageRating = {this.state.data["favoritedTemplates"][key].averageRating}
                        templateID = {this.state.data["favoritedTemplates"][key].templateID}
                        gameID = {this.state.data["favoritedTemplates"][key].gameID}
                        selected = {this.isSelected(0,key)}
                        />
                      </div>
                    ))}
                  </>
                </div>
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
                {/*Table displaying the dynamic data for Favorited Templates*/}
                {
                this.state.loaded == "True" &&
                <div className="RecentlyPlayed">
                  <> 
                    {/* Iterate through favorited templates and render the data in a tabular format */}
                    {Object.keys(this.state.data.recentlyPlayed).map(key => (
                      <TemplateRow rowPos={key} accPos="1" 
                      pictureURL = {this.state.data["recentlyPlayed"][key].pictureURL} 
                      templateName = {this.state.data["recentlyPlayed"][key].templateName}
                      numRatings = {this.state.data["recentlyPlayed"][key].numRatings}
                      averageRating = {this.state.data["recentlyPlayed"][key].averageRating}
                      />
                    ))}
                  </>
                </div>
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
                {/*Table displaying the dynamic data for Favorited Templates*/}
                {
                this.state.loaded == "True" &&
                <div className="HighestData">
                  <> 
                    {/* Iterate through favorited templates and render the data in a tabular format */}
                    {Object.keys(this.state.data.highestRated).map(key => (
                      <TemplateRow rowPos={key} accPos="2" 
                      pictureURL = {this.state.data["highestRated"][key].pictureURL} 
                      templateName = {this.state.data["highestRated"][key].templateName}
                      numRatings = {this.state.data["highestRated"][key].numRatings}
                      averageRating = {this.state.data["highestRated"][key].averageRating}
                      />
                    ))}
                  </>
                </div>
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
                this.state.loaded == "True" &&
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
    )
  }
}
