import React, { Component } from 'react'
import TemplateRow from "../TemplateRow"
import BottomUI from "../BottomUI"
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            searchQuery:"",
            loaded: false
        };
    }

    componentDidMount = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                searchQuery: this.state.searchQuery
            })
        };
    }

    queryHandler = (e) => {
        this.setState({
            searchQuery: e.target.value
        },
        this.searchDatabase
        );
    }

    searchDatabase = () => {
        
            
    }

    render() {

        const searchStyle = {
            borderRadius: "5px"
          };

        return (
            <div>
                {/* Search Bar */}
                <input placeholder="Search Templates"
                    style={searchStyle}
                    value={this.state.searchQuery}
                    onChange={this.queryHandler}
                />

                {/* Search results */}
                <TableContainer component={Paper}>
                <Table>
                {this.state.loaded === "True" &&
                    <> 
                    {Object.keys(this.state.data.favoritedTemplates).map(key => (
                        <>
                            <TableRow onClick={()=>this.selectTemplate(0,key)}>
                                <TemplateRow 
                                    pictureURL = {this.state.data["results"][key].pictureURL} 
                                    templateName = {this.state.data["results"][key].templateName}
                                    numRatings = {this.state.data["results"][key].numRatings}
                                    averageRating = {this.state.data["results"][key].averageRating}
                                />
                            </TableRow>
                            {this.isSelected(0,key) === true &&
                            <>
                                <BottomUI
                                    templateName = {this.state.data["results"][key].templateName}
                                    templateID = {this.state.data["results"][key].templateID}
                                    gameID = {this.state.data["results"][key].gameID}
                                    selected = {this.isSelected(0,key)}>
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