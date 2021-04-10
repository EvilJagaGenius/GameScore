import React,  {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import { IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import TemplateHintModal from './TemplateHintModal';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import BackIcon from '@material-ui/icons/ArrowBackIos'
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


    //Code adapted from: https://morioh.com/p/4576fa674ed8
    //Centers Modal on page
    function getModalStyle()
    {
        const top = 50;
        const left = 50;
        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            width: "90%",
            padding:18,
            backgroundColor:"white",
        };
    }

   

export default class TemplateEditor extends Component {

    constructor(props)
    {
        super(props)
        this.state=({
            templateID:0,
            data:{},
            loaded:false,
            showDeleteTemplate:false,
            modalStyle:getModalStyle(),
            showHintModal:false,
            showError:false,
            showSuccess:false,
            errorText:"",
            successText:""
        })
         this.closedHintModal = this.closedHintModal.bind(this)
    }

    closedHintModal()
    {
        this.setState({
            showHintModal:false
        })
    }

    handleChangeTemplateName(e)
    {
        if(e.target.value.length<4 || e.target.value.length>30)
        {
            this.setState({
            showError:true,
            errorText:"Template Name must be between 4 and 30 characters"
            })
            console.log("showing errorText")
            e.target.value = this.state.data.templateName
        }
        else
        {

             const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                  templateID: this.state.templateID,
                  templateName:e.target.value
                })
            };

            fetch("/api/postEditTemplateName",requestOptions)
              .then(res => res.json())
              .then((result) => {

                  console.log(result)
                  this.setState({
                    data:result,
                    loaded: true,
                    showSuccess:true,
                    successText:"Template Name Successfully Updated"
                  })

              },) //End Fetch
        }
    }

    //Tells server to create new empty condition
    handleAddCondition(e)
    {
        //Request Header
        const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            templateID:this.state.templateID,
            })
        };

        //Create new empty condition
        fetch("/api/postCreateCondition",requestOptions)
          .then(res => res.json())
          .then((result) => {

              console.log(result)

              //Sends user immediately to new condition
              this.props.history.push({
              pathname:"/mytemplates/conditioneditor",
              state:
              {templateID:this.state.data.templateID,
               conditionID:result.conditionID}
               
            });

          })
    }

    //Deletes template from Database
    handleDeleteTemplate(e)
    {
        //Request Header
        const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            templateID:this.state.templateID
            })
        };

        //Deletes tempalte in Database
        fetch("/api/postDeleteTemplate",requestOptions)
          .then(res => res.json())
          .then((result) => {

            //Sends user back to my templates screen
            this.props.history.push({
                  pathname:"/mytemplates"
                });
          })        
    }

    //On load
    componentDidMount()
    {
        //Grab template ID from whereever the player is coming from
        var templateID = 0;
        if(this.props.location!=null)
        {
            this.setState({
                templateID:this.props.location.state.templateID
            })

            templateID = this.props.location.state.templateID
        }


        //Request Header
         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
              templateID: templateID
            })
        };

        //Get All Conditions for this template from server
        fetch("/api/getConditions",requestOptions)
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
                this.state.loaded === true &&
                <>
                            {/*Header*/}
                            <div style={{whiteSpace:"nowrap"}}>
                              <div style={{textAlign:"center",display:"inlineBlock",paddingTop:2,paddingBottom:5}} align="center" textAlign= "center">

                                 <TextField inputProps={{style: {fontSize: 25,textAlign:"center"} }} style={{width:"70%",marginTop:10}} defaultValue={this.state.data.templateName}
                                    onBlur={(e)=>{
                                        //Validate and update template name
                                        this.handleChangeTemplateName(e)
                                    }}
                                 ></TextField>
                              </div>

                                 <div style={{paddingLeft:0,left:10,top:55,position:"absolute"}} align="left">
                                  {/*Back Button*/}
                                    <IconButton onClick={()=>{
                                            //Go to my template page
                                            this.props.history.push({
                                              pathname:"/mytemplates"
                                            });
                                    }}>
                                    <BackIcon></BackIcon>
                                    </IconButton>
                              </div>

                                <div style={{textAlign:"center",display:"inlineBlock",paddingTop:2,paddingBottom:15}} align="center" textAlign= "center">

                                        ({this.state.data.gameName})
                                </div>
                              <div style={{paddingLeft:0,right:5,top:50,position:"absolute"}} align="left">
                                  {/*Back Button*/}
                                      <IconButton onClick={()=>{
                                        this.setState({
                                            showHintModal:true
                                        })
                                    }}

                                    >
                                     <HelpOutlineIcon style={{fontSize:30}}></HelpOutlineIcon>
                                    </IconButton>
                              </div>
                            </div>
                    <>
                        {/*For each Condition, show values*/}
                        {Object.keys((this.state.data["conditions"])).map(key=> (
                              <TableContainer component = {Paper} style={{marginBottom:20}}> 
                                {/*Table for each condition*/}
                                <Table size="small" style={{ tableLayout: 'fixed' }}> 
                                    <TableHead >
                                        <TableRow style={{height:20}}>
                                            <TableCell colSpan={2} align="center" style={ (this.state.data["conditions"][key].description !== "") ? { borderBottom:'none'} : {}}>
                                                {/*Condition Name*/}
                                                <div style={{whiteSpace:"nowrap"}}>
                                                  <div style={{textAlign:"center",display:"inlineBlock",paddingTop:11,paddingBottom:-6}} align="center" textAlign= "center">

                                                     <Typography style={{fontSize:16}}><b>{this.state.data["conditions"][key].conditionName}</b></Typography>
                                                  </div>

                                                 {/*Edit Icon*/}
                                                  <div style={{paddingLeft:0,right:10,marginTop:-35}} align="right">
                                                         <IconButton style={{float:"right"}}

                                                        // Send user to condition editor for this condition on click
                                                        onClick={()=>{
                                                            console.log(this.state.data["conditions"][key].conditionID)
                                                            this.props.history.push({
                                                              pathname:"/mytemplates/conditioneditor",
                                                              state:
                                                              {templateID:this.state.data.templateID,
                                                               conditionID:this.state.data["conditions"][key].conditionID}
                                                               
                                                                });

                                                            }}>
                                                            <CreateIcon></CreateIcon>
                                                        </IconButton>
                                                  </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {/*Description (if exists)*/}
                                    <>
                                        {
                                            this.state.data["conditions"][key].description !== "" &&
                                            <TableRow style={{height:25}}>
                                                <TableCell colSpan={2} align="center">
                                                    <Typography style={{marginTop:-20}}></Typography>{this.state.data["conditions"][key].description}
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </>

                                    {/*Scoring Type*/}
                                    <TableRow>
                                        <TableCell  align="left:"><b>Scoring Type:</b></TableCell>
                                        <TableCell align="center">{this.state.data["conditions"][key].scoringType}</TableCell>
                                    </TableRow>

                                    {/*Points Multiplier or Tabular Table*/}
                                    <>
                                        {
                                        this.state.data["conditions"][key].scoringType==="Linear" &&
                                        <TableRow>
                                            <TableCell align="left:"><b>Point Multiplier:</b></TableCell>
                                            <TableCell align="center">{this.state.data["conditions"][key].pointMultiplier}</TableCell>
                                        </TableRow>
                                        }

                                        {
                                        this.state.data["conditions"][key].scoringType === "Tabular" && 
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                {/*New Table for Tabular Scoring*/}
                                                <TableContainer  component = {Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">
                                                                    InputMin
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    InputMax
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    Score
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        {console.log(this.state.data["conditions"][key]["valueRows"])}
                                                         {Object.keys((this.state.data["conditions"][key]["valueRows"])).map(rowNum=> (
                                                            //For each value row, show inputMin, inputMax, and outputVal
                                                            <TableRow>
                                                                <TableCell align="center">
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].inputMin}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].inputMax}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].outputVal}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </Table>
                                                </TableContainer> {/*End Tabular Table*/}
                                            </TableCell>
                                        </TableRow>
                                        }
                                     </>
                                    {/*Show max per game if active*/}
                                    <>
                                    {
                                        this.state.data["conditions"][key].maxPerGameActive === true &&
                                        <TableRow>
                                            <TableCell align="left:"><b>Max Per Game:</b></TableCell>
                                            <TableCell align="center">{this.state.data["conditions"][key].maxPerGame}</TableCell>
                                        </TableRow>
                                    }
                                    </>
                                    {/*Show max per player if active*/}
                                    {
                                    this.state.data["conditions"][key].maxPerPlayerActive === true &&
                                    <TableRow>
                                        <TableCell align="left:"><b>Max Per Player:</b></TableCell>
                                        <TableCell align="center">{this.state.data["conditions"][key].maxPerPlayer}</TableCell>
                                    </TableRow>
                                    }

                                    <TableRow style={{display:"none"}}>
                                        <TableCell align="left:"><b>Input Type:</b></TableCell>
                                        <TableCell align="center">{this.state.data["conditions"][key].inputType}</TableCell>
                                    </TableRow>

                                </Table>
                              </TableContainer>
                         ))}

                        <>
                        {/*Alert Snackbar*/}
                        <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={(e,reason)=>{
                            //Allows snackbar to appear even on blur trigger
                            if(reason !== "clickaway")
                            {
                                this.setState({showError:false})
                                console.log(reason)}
                            }

                            }>
                            <Alert variant = "filled" severity="error">
                              {this.state.errorText}
                            </Alert>
                         </Snackbar>

                        {/*Success Snackbar*/}
                       <Snackbar open={this.state.showSuccess} autoHideDuration={3000} onClose={()=>{this.setState({showSuccess:false})}}>
                        <Alert variant = "filled" severity="success">
                          {this.state.successText}
                        </Alert>
                      </Snackbar>
                    </>

                    </>

                    <div style={{position:"fixed",marginRight: "5% auto",marginLeft: "5% auto", bottom:0,display:"flex",justifyContent:"center", left:0,right:0,backgroundColor:"white",marginTop:0}}>
                        <Button  variant = "contained" color="primary" size = "large" style={{margin:5}} startIcon={<AddIcon />}
                        onClick={(e)=>{

                            //Create New Condition
                            this.handleAddCondition(e)
                    
                        }}> Add Condition</Button>


                        <Button  variant = "contained" color="primary" size = "large" style={{margin:5}} startIcon={<DeleteIcon />}
                        onClick={()=>{
                        //Create Game with Same number of players API call
                            this.setState({
                                showDeleteTemplate:true
                            })
                        }}> Delete Template</Button>

                    </div>

                        

                    <div style={{height:60}}>
                        
                    </div>

                    {/*Delete Template Modal*/}

                    <Modal
                    open={this.state.showDeleteTemplate}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"

                  >
                  <div style={this.state.modalStyle} component={Paper}>
                    <div>
                      <h3 style={{textAlign:"center"}}>Delete Template?</h3>
                    
                      <Typography>Delete [{this.state.data.templateName}]?  This template will be gone forever.</Typography>

                       <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>

                          {/*Confirm Finalize Score*/}
                          <Button  variant = "contained" color="primary" size = "large" onClick={(e)=>{
                        
                           this.handleDeleteTemplate(e)
                        
                          }}>Delete</Button>

                          {/*Cancel Finalize Scoring*/}
                          <Button  variant = "contained" color="primary" size = "large" onClick={()=>this.setState({showDeleteTemplate:false})
                          }>Cancel</Button>

                      </div>

                    </div>
                 </div>
                  </Modal>
                
                <TemplateHintModal show={this.state.showHintModal} closeHint={this.closedHintModal}></TemplateHintModal>

                 
                </>
                }
            </>
        );
    }
}