import React, { Component } from "react";
import TemplateRow from "../TemplateRow";
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import BottomUI from "../BottomUI";
import TextField from '@material-ui/core/TextField';
import Cookies from 'js-cookie';
import {Alert} from "@material-ui/lab";

export default class MyTemplates extends Component {

  constructor(props)
  {
      super(props)

        this.state =({
        data:{},
        loaded:false,
        selectedTemplate:-1,
        searching: "false",
        searchQuery: "",
        filtered: {}
      })

      if(Cookies.get("username") !== ""){
        this.callAPI = this.callAPI.bind(this)
      }
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
    if(Cookies.get("username") !== ""){
      this.callAPI()
    }
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
    if (this.state.searchQuery !== "" && this.state.loaded === true) {
      currentList = this.state.data;
      console.log(currentList);
      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(template => {
        // change current item to lowercase
        const tnlc = template.templateName.toLowerCase();

        // change search term to lowercase
        const filter = this.state.searchQuery.toLowerCase();

        //Determine if the query is in the template's name
        return tnlc.includes(filter);
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
    return (
      <>
      {Cookies.get("username")
      ? <>
        {/* Search Bar */}
        <TextField id="outlined-basic" label="Search Templates" variant="outlined" value={this.state.searchQuery} onChange={this.handleChange} style={{width:"90%",marginLeft:"5%", marginTop:"1%",marginBottom:"1%"}} />

        {/* Wipe out default content when actively searching */}
        {this.state.searching === "false" &&
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
                      {this.isSelected(key) === true &&
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
                            rate= {true}
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
        </>
        }

        {/* Display Search Results */}
        {this.state.loaded === true &&
        <>
        <TableContainer component={Paper}>
          <Table>
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
          </Table>
        </TableContainer>
        </>
        }
          <Link to="/mytemplates/creator">
            <Fab color="primary" aria-label="add" style={{position:"fixed",right:20,bottom:20}}>
              <AddIcon fontSize="large"/>
            </Fab>
          </Link>
      </>
      : <>
        <Alert severity="error">You must be logged in to view the My Templates page</Alert>
        </>
      }
      </>
    )
  }
}