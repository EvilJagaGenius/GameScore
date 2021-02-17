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
import { Container, Button } from 'react-floating-action-button';
import { useHistory } from "react-router-dom";

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

  routeTemplateEditor() {
    let path = '/mytemplates/templatecreator';
    let history = useHistory();
    history.push(path);
  }

  render() {

    return (
      <div>
        <TableContainer component={Paper}>
          <Table size="small">
                {/*Table displaying the dynamic data for the users created templates*/}
                {
                this.state.loaded == "True" &&
                <div className="MyTemplates">
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
                </div>
              }
          </Table>
        </TableContainer>
        <Container>
          <Button
            tooltip="Create New Template"
            icon="fas fa-plus"
            rotate={true}
            onClick={routeTemplateEditor()} />
        </Container>
      </div>
    )
  }
}