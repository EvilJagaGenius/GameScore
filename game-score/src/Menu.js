/**
 * Menu.js-Jonathan Beels
 */

import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import HomeData from "./HomeData"

export default class Menu extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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

          {/*Table displaying the dynamic data for Favorited Templates*/}
          <table>
            {HomeData.favoritedTemplates.map(template => (
              <tr>
                <td>{template.pictureURL}</td>
                <td>{template.templateName}</td>
                <td>{template.NumRatings}</td>
                <td>{template.averageRating}</td>
              </tr>
            ))}
          </table>
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
          <table>
            {HomeData.recentlyPlayed.map(template =>(
              <tr>
                <td>{template.pictureURL}</td>
                <td>{template.templateName}</td>
                <td>{template.NumRatings}</td>
                <td>{template.averageRating}</td>
              </tr>
            ))}
          </table>
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
          <table>
            {HomeData.highestRated.map(template => (
              <tr>
                <td>{template.pictureURL}</td>
                <td>{template.templateName}</td>
                <td>{template.NumRatings}</td>
                <td>{template.averageRating}</td>
              </tr>
            ))}
          </table>
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
          <table>
            {HomeData.recommendedGames.map(game => (
              <tr>
                <td>{game.pictureURL}</td>
                <td>{game.gameName}</td>
              </tr>
            ))}
          </table>
        </Accordion.Content>
      </Accordion>
    )
  }
}
