import React from 'react';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';


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
                                this.props.history.push('/home') //Send to homescreen
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