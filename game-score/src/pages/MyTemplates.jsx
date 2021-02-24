/**
 * MyTemplates.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code. Component is implemented in the global tab system
 */

 //import resources
import React, { Component } from "react";
import TemplateRow from "../TemplateRow";
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
// import { Container, Link } from 'react-floating-action-button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom'

export default class MyTemplates extends Component {

  state = {
    data:{},
    loaded:"False",
    selectedTemplate:{accPos:0,rowPos:0}
  }


  componentDidMount() {
    fetch("/api/myTemplates") //Needs an actual route
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result,
            loaded: "True"
          }
          );
          console.log(result)
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

  /*
  function RouteTemplateEditor() {
    let path = '/mytemplates/templatecreator';
    let history = useHistory();
    history.push(path);

  }
  */

  handleClick() {

  }

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
                      <div onClick={()=>this.selectTemplate(0,key)}>
                        <TemplateRow rowPos={key} accPos="0" 
                        pictureURL = {this.state.data[key].pictureURL} 
                        templateName = {this.state.data[key].templateName}
                        numRatings = {this.state.data[key].numRatings}
                        averageRating = {this.state.data[key].averageRating}
                        templateID = {this.state.data[key].templateID}
                        gameID = {this.state.data[key].gameID}
                        selected = {this.isSelected(0,key)}
                        />
                      </div>
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