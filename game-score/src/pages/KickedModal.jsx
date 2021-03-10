import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import SaveIcon from '@material-ui/icons/Save';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
        padding:10,
        backgroundColor:"white",
    };
}


export default class KickedModal extends React.Component {

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
                            <h3 style={{textAlign:"center"}}>Kicked!</h3>
                         </div>
                         <Typography>You have been kicked by the host.  This match will not added to your account.</Typography>

                           <div style={{ justifyContent:'center',marginTop:11,display:"flex"}}>

                              <Button variant = "contained" color="primary" size = "large" onClick={()=>{
                                this.props.history.push('/home')

                                }}
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