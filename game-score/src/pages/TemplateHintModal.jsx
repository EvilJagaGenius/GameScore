import React from 'react';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
                     
                     <div style={{display:"inline"}}>
                         <div style={{marginTop:11}}>
                            <h3 style={{textAlign:"center"}}>Template Help:</h3>
                         </div>
                        
                        <div style={{width:"100%",display:"block"}}>
                           <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Parameter
                                            </TableCell>
                                            <TableCell align="center">
                                                Explanation
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableRow>
                                            <TableCell>
                                                Scoring Type
                                            </TableCell>
                                            <TableCell>
                                                <b>Linear:</b> Deault. Every value of this condition is given the same score.  The 5th 'X' will score the same as the 27th 'X'.  Good for most use-cases. <br/>
                                                <b>Tabular:</b> Allows specification of ranges to determine condition score.  The player will receive a score specific to which range the value falls within.  Ranges are specified with a min (inclusive), max value (exclusive), and acompanying score.  Ranges are checked in order of position, stopping once the value falls within a range.
                                            </TableCell>
                                    </TableRow>

                                    <TableRow>
                                            <TableCell>
                                                Point Multiplier
                                            </TableCell>
                                            <TableCell>
                                                Only used with linear scoring.  Will be multiplied by the 'value' to determine the score for the given condition.  Example: If a use enters a value of 4 - when the point multiplier is 3 - the score will be 12.
                                            </TableCell>
                                    </TableRow>

                                    <TableRow>
                                            <TableCell>
                                                Input Type
                                            </TableCell>
                                            <TableCell>
                                                <b>Textbox:</b> Players will be able to type in their values using their keyboard for this condition. Good for conditions with large, expected values or decimals. <br/>
                                                <b>Increment:</b> Players will change the values using arrows.  Good for integers and low-valued conditions.
                                            </TableCell>
                                    </TableRow>

                                    <TableRow>
                                            <TableCell>
                                                Max Per Game
                                            </TableCell>
                                            <TableCell>
                                                Specifies max of sum of 'values' for this condition, regardless of player.  A Max Per Game of 2 stipulates that the sum of all values for this condition be less than or equal to 2.  Good for superlatives and global awards.  A (bypassable) prompt will warn players if trying to finalize without meeting this criteria. 
                                            </TableCell>
                                    </TableRow>

                                    <TableRow>
                                            <TableCell>
                                                Max Per Player
                                            </TableCell>
                                            <TableCell>
                                                Same as 'Max Per Game', but counts each player individually.  Specifies max of sum of 'values' for this condition for each player.  A Max Per Player of 4 stipulates that each player's value for this condition must be less than or equal to 4.  Good for individual awards and elements limited by supply.  A (bypassable) prompt will warn players if trying to finalize without meeting this criteria. 
                                            </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </div>


                           <div style={{ justifyContent:'center',marginTop:11,display:"flex"}}>

                           

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