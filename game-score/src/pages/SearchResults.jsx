import React, { Component } from 'react'
import TemplateRow from "../TemplateRow"
import BottomUI from "../BottomUI"
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';

export default class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            filtered: {},
            searchQuery:"",
            loaded: "false",
            searching: "false"
        }

    }

    componentDidMount() {

        fetch("/api/search/templates")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        data: result.templates,
                        loaded: "true"
                    });
                    console.log(result)
                },
                
            )
    }

    selectTemplate(newRowPos) {
        this.setState({
            selectedTemplate: newRowPos
        })
        console.log(this.state.selectedTemplate)
    }

    isSelected(checkRowPos) {
        if(checkRowPos === this.state.selectedTemplate) {
            return true
        }
        else {
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
        if (this.state.searchQuery !== "" && this.state.loaded === "true") {
            currentList = this.state.data;
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

    render() {

        const searchStyle = {
            borderRadius: "5px"
          };

        return (
            <div>
                {/* Back button */}
                <Link to = "/home">
                    <input type="button" value="Back"/>
                </Link><br/>

                {/* Search Bar */}
                <input placeholder="Search Templates"
                    style={searchStyle}
                    value={this.state.searchQuery}
                    onChange={this.handleChange}
                />

                {/* Search results */}
                {this.state.searching === "false" &&
                    <>
                        <p>Try searching for something!</p>
                    </>
                }
                <TableContainer component={Paper}>
                <Table>
                {this.state.loaded === "true" &&
                  <> 
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
                                    selected = {this.isSelected(key)}
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
            </div>
        )
    }
}