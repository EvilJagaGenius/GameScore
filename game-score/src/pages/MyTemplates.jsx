
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

  constructor(props)
  {
      super(props)

        this.state =({
        data:{},
        loaded:false,
        selectedTemplate:-1
      })

      this.callAPI = this.callAPI.bind(this)
  }


  callAPI()
  {
    this.setState({
      selectedTemplate:-1})

      const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
      })
    };

    fetch("/api/getMyTemplates",requestOptions) //Needs an actual route
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result.templates,
            loaded: true
          });
          console.log(result)
        },
      )

  }

  componentDidMount() 
  {
    this.callAPI()
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


  render() {
    const { classes } = this.props;
    return (
      <>
        <TableContainer component={Paper}>
          <Table size="small">
                {/*Table displaying the dynamic data for the users created templates*/}
                {
                this.state.loaded === true &&
                <> 
                    {/* Iterate through created templates and render the data in a tabular format */}
                    {Object.keys(this.state.data).map(key => (
                      <>
                      <TableRow onClick={()=>this.selectTemplate(key)}>
                        <TemplateRow rowPos={key}
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
                            templateName = {this.state.data[key].templateName}
                            templateID = {this.state.data[key].templateID}
                            gameID = {this.state.data[key].gameID}
                            selected = {this.isSelected(key)}
                            play ={true}
                            edit = {true}
                            del = {true}
                            update ={this.callAPI}>

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
            <Fab color="primary" aria-label="add" style={{position:"fixed",right:20,bottom:20}}>
              <AddIcon fontSize="large"/>
            </Fab>
          </Link>
      </>
    )
  }
}