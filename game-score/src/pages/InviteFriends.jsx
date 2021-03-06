import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from "react-router-dom";
var QRCode = require('qrcode.react');


function InviteFriends() {

  //Set States and Defaults
  const [data, setData] = useState({"joinCode":"000-000-000"});
  const [loaded, setLoaded] = useState(false);
  let history = useHistory()

  //On Load
  useEffect(() => {

      //Call API to get Invite Info; Provides join code to show / create QR code from
      if(loaded === false)
      {
        fetch("/api/getInviteInfo").then(res => res.json()).then(newData => {
          setLoaded(true)
          setData(newData)
          console.log(newData)
        });
      }

  },[]);


  //Returns Components to draw on screen
  return (
    <>
      {
      loaded == true && 
      <>

        {
          data["successful"] == false &&
          <>
            {
              data["errorMessage"]!=null && 
              <h2>{data["errorMessage"]}</h2>
            }
            <link>
              
            </link>
            <Button onClick={()=> history.push('/home')}variant = "contained" color="primary" size = "large">Return Home</Button>
          </> 
          }


        {
        data.successful == true && 
        <>
        {/*Header with title and back button*/}
        <div style={{whiteSpace:"nowrap"}}>
            <div style={{textAlign:"center",display:"inlineBlock",marginTop:15,marginBottom:10}} aligxn="center" textAlign= "center">
                <h2 style={{display:"inline"}}>Invite Friends</h2>
            </div>
            <div style={{paddingLeft:0,left:5,top:15,position:"absolute"}} align="left">
                <Link to={{pathname: "/play/overview"}}>
                    <Button startIcon={<BackIcon/>}>
                    </Button>
                </Link>
            </div>
        </div>

            { //Show Join Stuffs if loaded
              loaded === true &&
              <>
                {/*QR Code*/}
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:0}} align="center" textAlign= "center">
                    <h4 style={{display:"inline"}}>Invite via QR Code:</h4>
                </div>
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:5,marginBottom:10}} align="center" textAlign= "center">
                   <QRCode style={{width:"50%",maxWidth:250,maxHeight:250, height:"50%",textAlign:"center"}}  value={"http://gamescore.gcc.edu:3000/playgame?joinCode="+data.joinCode.toUpperCase()}/>
                </div>

                 <div style={{textAlign:"center",display:"inlineBlock",marginTop:40,marginBottom:0}} align="center" textAlign= "center">
                    <h2 style={{display:"inline"}}>OR</h2>
                </div>

                {/*Join Code*/}
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:40,marginBottom:0}} align="center" textAlign= "center">
                    <h4 style={{display:"inline"}}>Invite via Join Code:</h4>
                </div>
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:0,marginBottom:10}} align="center" textAlign= "center">
                  <Typography style={{fontSize:"32px"}}>{data.joinCode.toUpperCase()}</Typography>
                </div>
                
              </>
              }
            </>
            }
        </>
      }
    </>
  );
}

export default InviteFriends;