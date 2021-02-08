/**
 * Menu.js-Jonathan Beels
 */

import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'

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

    //intialize data
    const [favoriteTemplates, setFavoriteTemplates] = useState(0);
    const [recentlyPlayedTemplates, setRecentlyPlayed] = useState(0);
    const [highestRatedTemplates, setHighestRated] = useState(0);
    const [recommended, setRecommended] = useState(0);

    //request data from flask server and assign data accordingly
    useEffect(() => {
      fetch('/api/getHomePage').then(res => res.json()).then(data => {
        setFavoriteTemplates(data.favoritedTemplates);
        setRecentlyPlayed(data.recentlyPlayed);
        setHighestRated(data.highestRated);
        setRecommended(data.recommendedGames);
      });
    }, []);

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
          <p>
            { favoriteTemplates }
          </p>
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
          <p>
            { recentlyPlayedTemplates }
          </p>
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
          <p>
            { highestRatedTemplates }
          </p>
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
          <p>
            { recommended }
          </p>
        </Accordion.Content>
      </Accordion>
    )
  }
}
