import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';

export default class TemplateCreator extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = ({data:"",
        loaded:false,
        cloneID:-1,
        templateName:"",
        gameID:0
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

                    <Typography style={{marginLeft:"5%", marginTop:15}}><b>Template Name:</b></Typography>
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
                                ToastsStore.error("Game Missing");
                            }
                            else if(this.state.templateName==="")
                            {
                                ToastsStore.error("Template Name Missing");
                            }
                            else if(this.state.cloneID===0)
                            {
                                ToastsStore.error("Tempalate to Clone Missing");
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
                                    ToastsStore.success("Template Created");

                                      this.props.history.push({
                                      pathname:"/mytemplates/editor",
                                      state:{templateID:data.templateID}
                                    });
                                })

                            }
                        }}


                        > Create</Button>
                        <Button style={{marginLeft:7}}size = "large" startIcon={<SaveIcon/>} variant = "contained" color="primary"
                        onClick={()=>{
                        this.props.history.goBack()
                        }}

                        > Cancel</Button>

                    </div>

                    <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
                </>

                
                }
            </>
        );
    }

};