/**
 * MyTemplates.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code. Component is implemented in the global tab system
 */

 //import resources
import React, { Component } from "react";
import GameRow from "../GameRow"
import TemplateRow from "../TemplateRow";
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import { Container, Link } from 'react-floating-action-button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import BottomUI from "../BottomUI";

export default class MyTemplates extends Component {

  state = {
    data:{},
    loaded:"False",
    selectedTemplate:-1
  }


  componentDidMount() {
    fetch("/api/myTemplates") //Needs an actual route
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result,
            loaded: "True"
          });
          console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
      )
  }

  selectTemplate(newRowPos)
  {
    this.setState({
      selectedTemplate: newRowPos
    })
    console.log(this.state.selectedTemplate)
  }

  isSelected(checkRowPos)
  {
    if(checkRowPos === this.state.selectedTemplate)
    {
      return true
    }
    else
    {
      return false
    }
  }

  /*
  function RouteTemplateEditor() {
    let path = '/mytemplates/templatecreator';
    let history = useHistory();
    history.push(path);

  }
  */

  render() {
    const { classes } = this.props;
    return (
      <>
        <TableContainer component={Paper}>
          <Table size="small">
                {/*Table displaying the dynamic data for the users created templates*/}
                {
                this.state.loaded === "True" &&
                <> 
                    {/* Iterate through created templates and render the data in a tabular format */}
                    {Object.keys(this.state.data).map(key => (
                      <>
                      <TableRow onClick={()=>this.selectTemplate(key)}>
                        <TemplateRow rowPos={key} accPos="0" 
                        pictureURL = {this.state.data[key].pictureURL} 
                        templateName = {this.state.data[key].templateName}
                        numRatings = {this.state.data[key].numRatings}
                        averageRating = {this.state.data[key].averageRating}
                        templateID = {this.state.data[key].templateID}
                        gameID = {this.state.data[key].gameID}
                        selected = {this.isSelected(key)}
                        />
                      </TableRow>
                      {this.isSelected(key) == true &&
                        <>
                          {console.log(this.state.data[key])}
                          <BottomUI
                            templatename = {this.state.data[key].templateName}
                            templateid = {this.state.data[key].templateID}
                            gameid = {this.state.data[key].gameID}
                            selected = {this.isSelected(key)}
                            play ={true}
                            edit = {true}
                            del = {true}>
                            </BottomUI>
                        </>
                      }
                      </>
                    ))}
                  </>
              }
          </Table>
        </TableContainer>
        <Link to="/mytemplates/creator">
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </>
    )
  }
}