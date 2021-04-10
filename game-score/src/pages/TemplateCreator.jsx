import React from 'react';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


//Prevent every single game from being displayed to prevent lag
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

    //On Load
    componentDidMount()
    {
        //Grab all games and tempaltes from server
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

    //Checks to make sure all required pieces are present and then creates template
    handleCreateTemplate(e)
    {
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

                        if(reason ==='clear') //If erased, set to blank
                        {
                            this.setState({gameID:0})
                        }
                        else if(reason ==='select-option' || reason ==='blur') //if selected or clicked away, set to selected
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

                        if(reason ==='clear') //If erased, set to blank
                        {
                            this.setState({cloneID:0})
                        }
                        else if(reason ==='select-option' || reason ==='blur') //if selected or clicked away, set to selected
                        {
                            this.setState({cloneID:newValue.templateID})
                        }
                        
                        }}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                    />

                    <div style={{justifyContent:"center",display:"flex",marginTop:20}}>

                        {/*Create Button*/}
                        <Button style={{marginRight:7}}size = "large" startIcon={<AddIcon/>} variant = "contained" color="primary"
                        onClick={(e)=>{
                          this.handleCreateTemplate(e)
                        }}
                        > Create</Button>

                        {/*Cancel Button*/}
                        <Button style={{marginLeft:7}}size = "large" startIcon={<ClearIcon/>} variant = "contained" color="primary"
                        onClick={()=>{
                        this.props.history.goBack()
                        }}

                        > Cancel</Button>

                    </div>

                    <Typography style = {{fontSize:10,display:"flex",justifyContent:"center",marginTop:30,marginLeft:15,marginRight:15}}>
                      By creating a template, you are agreeing that all board game templates within GameScore that you create will fall under a CC0 copyright policy.
                    </Typography>

                  {/*Error Alert*/}
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