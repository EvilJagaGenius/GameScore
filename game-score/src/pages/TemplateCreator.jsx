import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';



const filterOptions = createFilterOptions({
  limit:30
});


export default class TemplateCreator extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = ({data:"",
        loaded:false,
        cloneID:-1,
        templateName:"",
        gameID:0,
        showError:false,
        errorText:""
        })
    }

    componentDidMount()
    {
        fetch("/api/getGamesAndTemplates")
          .then(res => res.json())
          .then((result) => {

              console.log(result)
              this.setState({
                data:result,
                loaded: true
              })

          },) //End Fetch
    }

    render()
    {
        return(
            <>
                {
                this.state.loaded ===true &&
                <>
                    <div style={{display:"flex",justifyContent:"center",marginTop:15,marginBottom:15}}>
                        <h2 textAlign="center">Create New Template</h2>
                    </div>
                    


                    <Typography style={{marginLeft:"5%"}}><b>Game:</b></Typography>
                    <Autocomplete
                      options={this.state.data.games}
                      style={{width:"90%",marginLeft:"5%"}}
                      getOptionLabel={(option) => option.gameName}
                      filterOptions={filterOptions}
                      onChange={(e,newValue,reason)=>{

                        if(reason ==='clear')
                        {
                            this.setState({gameID:0})
                        }
                        else if(reason ==='select-option' || reason ==='blur')
                        {
                            this.setState({gameID:newValue.gameID})
                        }
                        
                        }}
                      renderInput={(params) => <TextField {...params}variant="outlined" />}
                    />

                    <Typography style={{marginLeft:"5%", marginTop:15}}><b>Template Name:</b></Typography>
                    <TextField variant="outlined" style={{width:"90%",marginLeft:"5%"}} onChange={(e)=>this.setState({templateName:e.target.value})}> </TextField>

                    <Typography style={{marginLeft:"5%", marginTop:15}}><b>Template to Clone from:</b></Typography>
                    <Autocomplete
                      defaultValue={{templateName:"<Do Not Clone>",templateID:-1}}
                      style={{width:"90%",marginLeft:"5%"}}
                      options={this.state.data.templates}
                      getOptionLabel={(option) => option.templateName}
                      onChange={(e,newValue,reason)=>{

                        if(reason ==='clear')
                        {
                            this.setState({cloneID:0})
                        }
                        else if(reason ==='select-option' || reason ==='blur')
                        {
                            this.setState({cloneID:newValue.templateID})
                        }
                        
                        }}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                    />

                    <div style={{justifyContent:"center",display:"flex",marginTop:20}}>
                        <Button style={{marginRight:7}}size = "large" startIcon={<AddIcon/>} variant = "contained" color="primary"
                        onClick={()=>{
                        
                            if(this.state.gameID===0)
                            {
                                this.setState({
                                  showError:true,
                                  errorText:"No Game Selected"
                                })
                            }
                            else if(this.state.templateName==="")
                            {
                                this.setState({
                                  showError:true,
                                  errorText:"Template Name Missing"
                                })
                            }
                            else if(this.state.templateName.length<4 || this.state.templateName.length>30)
                            {
                              this.setState({
                                  showError:true,
                                  errorText:"Template Name must be between 4 and 30 characters"
                                })
                            }
                            else if(this.state.cloneID===0)
                            {
                                this.setState({
                                  showError:true,
                                  errorText:"Template to Clone From Missing"
                                })
                            }
                            else //If Good
                            {

                                const requestOptions = {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    credentials: 'include',
                                    body: JSON.stringify({
                                      gameID: this.state.gameID,
                                      cloneID: this.state.cloneID,
                                      templateName: this.state.templateName
                                    })
                                };

                                fetch(`/api/postCreateTemplate`,requestOptions)
                                    .then(res => res.json()).then(data => {
                                    console.log(data);

                                      this.props.history.push({
                                      pathname:"/mytemplates/editor",
                                      state:{templateID:data.templateID}
                                    });
                                })

                            }
                        }}


                        > Create</Button>
                        <Button style={{marginLeft:7}}size = "large" startIcon={<ClearIcon/>} variant = "contained" color="primary"
                        onClick={()=>{
                        this.props.history.goBack()
                        }}

                        > Cancel</Button>

                    </div>

                  <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={()=>{this.setState({showError:false})}}>
                    <Alert variant = "filled" severity="error">
                      {this.state.errorText}
                    </Alert>
                  </Snackbar>
                </>

                
                }
            </>
        );
    }

};