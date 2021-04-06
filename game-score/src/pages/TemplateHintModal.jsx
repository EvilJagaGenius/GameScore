import React from 'react';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';


//Code adapted from: https://morioh.com/p/4576fa674ed8
//Centers Modal on page
function getModalStyle()
{
    return {
        top: `5%`,
        left: `6%`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: "90%",
        padding:10,
        backgroundColor:"white",
        minHeight:"90%"
    };
}

export default class TemplateHintModal extends React.Component {

    constructor(props)
    {
        super(props)

        this.state = ({
            modalStyle:getModalStyle(),
            loaded:true
        })
    }




    render()
    {
        return(
            <>
                {
                this.state.loaded === true &&
                <Modal
                    open={this.props.show}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style= {{ overflow:'scroll'}}
                  >
                  <div style={this.state.modalStyle}>
                     
                     <div style={{display:"block",margin:0,maginTop:0,marginBottom:"auto",height:"90%"}}>


                        <div style={{height:"90%"}}>

                         <div style={{marginTop:11}}>
                            <h2 style={{textAlign:"center",marginBottom:10}}>Template Help:</h2>
                         </div>
                        



                        <div style={{width:"100%",display:"block"}}>

                         <Accordion >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header">
                              <Typography variant="h6" style={{fontSize:16}}>Scoring Type</Typography>
                            </AccordionSummary>

                            {/*Score Overview Rows*/}
                            <AccordionDetails>
                                <Typography>
                                <b>Overview:</b> <br/>
                                <ul>
                                    <li>
                                         Determines how player's input is translated into a score.
                                    </li>
                                </ul>

                                <b>Option: Linear</b> <br/>
                                <ul>
                                    <li>
                                         Score = Input * Point Multiplier
                                    </li>
                                    <li>
                                         Use Case: <i>Scoring is simple and predictable.</i>
                                    </li>
                                    <li>
                                         Example: <i>Each cow is worth 2 points.  Linear scoring is correct because getting the 1st cow is worth the same amount as getting the 8th cow.</i> <br/>

                                    </li>
                                </ul>

                                 <b>Option: Tabular</b> <br/>
                                <ul>
                                    <li>
                                         Score = Determined by table.
                                    </li>
                                    <li>
                                         Use Case: <i>Similar inputs can receive the same score or ranges of inputs dictate score.</i>
                                    </li>
                                    <li>
                                         Example: <i>Having 1 cow is worth 1 point, having 2 or 3 cows is worth 2 points. Tabular is necessary since every additional cow increases the score by a different amount.</i> <br/>
                                    </li>
                                    <li>
                                         Details: <i> The player will receive a score specific to which range the value falls within. Ranges are specified with a min (inclusive), max value (exclusive), and acompanying score.  Ranges are checked in order of position, stopping once the player's input falls within a range.</i> <br/>
                                    </li>
                                </ul>
                            
                                </Typography>
                            </AccordionDetails>
                          </Accordion>

                         <Accordion >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header">
                              <Typography variant="h6" style={{fontSize:16}}> Point Multiplier</Typography>
                            </AccordionSummary>

                            {/*Score Overview Rows*/}
                            <AccordionDetails>
                                <Typography>
                                <b>Overview:</b> <br/>
                                <ul>
                                    <li>
                                         Only used in Linear Scoring.
                                    </li>
                                     <li>
                                         Score = Input * Point Multiplier.
                                    </li>
                                </ul>

                                <b>Details</b> <br/>
                                <ul>
                                     <li>
                                         Can be negative.
                                    </li>
                                    <li>
                                         Example: <i>Each cow is worth 2 points.  A point multiplier of 2 is necessary.  When the user inputs 4 they will score (2 * 4) = 8.</i> <br/>
                                    </li>
                                </ul>
                                </Typography>
                            </AccordionDetails>
                          </Accordion>

                           <Accordion >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header">
                              <Typography variant="h6" style={{fontSize:16}}>Max Per Player</Typography>
                            </AccordionSummary>

                            {/*Score Overview Rows*/}
                            <AccordionDetails>
                                <Typography>
                                <b>Overview:</b> <br/>
                                <ul>
                                    <li>
                                         Specifies max input that each player should have.
                                    </li>
                                </ul>

                                <b>Details</b> <br/>
                                <ul>
                                     <li>
                                         Use Case: <i>Good for player-based limitations and enforcing easily-forgotten rules.</i>
                                    </li>
                                    <li>
                                         Example: <i>Each cow is worth 2 points.  However, each player can only have up to 4 cows.  Using a max per player of 4 remind users that only up to 4 cows are allowed.</i> <br/>
                                    </li>
                                     <li>
                                         If Over: <i>Conditions where the player has exceeded the maximum will be shown as red.  Additionally, a bypassable prompt will warn players when they attempt to finalize the game.</i> <br/>
                                    </li>
                                </ul>

  
                            
                                </Typography>
                            </AccordionDetails>
                          </Accordion>

                           <Accordion >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header">
                              <Typography variant="h6" style={{fontSize:16}}>Max Per Game</Typography>
                            </AccordionSummary>

                            {/*Score Overview Rows*/}
                            <AccordionDetails>
                                <Typography>
                                <b>Overview:</b> <br/>
                                <ul>
                                    <li>
                                         Specifies max input that all players combined can have for this condition.
                                    </li>
                                </ul>

                                <b>Details</b> <br/>
                                <ul>
                                     <li>
                                         Use Case: <i>Good for global awards (Longest Road, Largest Army, etc) or elements with fixed supplies (Only X of this building is allowed) .</i>
                                    </li>
                                    <li>
                                         Example: <i>Three awards worth 5 points are given for the most animals (sheep, pigs, and cows).  We call the condition 'Animal Awards'.  We set the max per game to 3 (because of three animal types) and the point multiplier to 5.  If a player has the most pigs and sheep, they would enter 2 - giving them 10 points.  The other player may only have the most cows - giving them 5 points.</i> <br/>
                                    </li>
                                     <li>
                                         If Over: <i>Conditions where the lobby of players has exceeded the maximum will be shown as red.  Additionally, a bypassable prompt will warn players when they attempt to finalize the game.</i> <br/>
                                    </li>
                                </ul>

  
                            
                                </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </div>

                        </div>

                           <div style={{ justifyContent:'center',marginTop:20,marginBottom:0,display:"flex"}}>

                           

                              {/*Cancel Finalize Scoring*/}
                              <Button variant = "contained" color="primary" size = "large" onClick={()=>{this.props.closeHint()}}
                                >Ok</Button>

                          </div>
                      </div>
                    </div>
                  </Modal>
                  }
            </>
        );
    }

};