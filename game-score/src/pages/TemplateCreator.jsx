import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import SaveIcon from '@material-ui/icons/Save';

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
                    <Autocomplete
                      options={this.state.data.games}
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
                      renderInput={(params) => <TextField {...params} label="Game" variant="outlined" />}
                    />

                    <TextField onChange={(e)=>this.setState({templateName:e.target.value})} label="Name Template Name"> </TextField>

                    <Autocomplete
                      defaultValue={{templateName:"<Do Not Clone>",templateID:-1}}
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
                      renderInput={(params) => <TextField {...params} label="Template to Clone" variant="outlined" />}
                    />

                    <Button startIcon={<AddIcon/>} variant = "contained" color="primary"
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


                    > Create Template</Button>
                    <Button startIcon={<SaveIcon/>} variant = "contained" color="primary"
                    onClick={()=>{
                    this.props.history.goBack()
                    }}

                    > Cancel</Button>

                    <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
                </>

                
                }
            </>
        );
    }

};