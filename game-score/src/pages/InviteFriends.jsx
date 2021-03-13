import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useState, useEffect } from 'react';
import BackIcon from '@material-ui/icons/ArrowBackIos';
var QRCode = require('qrcode.react');


function InviteFriends() {

  //Set States
  const [data, setData] = useState({"joinCode":"000-000-000"});
  const [loaded, setLoaded] = useState(false);

  //On Load
  useEffect(() => {

      //Call API to get Invite Info
      if(loaded === false)
      {
        fetch("/api/getInviteInfo").then(res => res.json()).then(newData => {
          setLoaded(true)
          setData(newData)
          console.log(newData)
        });
      }
  },[]);


  return (
    <>
      {/*Header*/}
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
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:0}} align="center" textAlign= "center">
              <h4 style={{display:"inline"}}>Invite via QR Code:</h4>
          </div>
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:5,marginBottom:10}} align="center" textAlign= "center">
             <QRCode style={{width:"50%",maxWidth:250,maxHeight:250, height:"50%",textAlign:"center"}}  value={"gamescore.gcc.edu:3000/playgame?joinCode="+data.joinCode.toUpperCase()}/>
          </div>

           <div style={{textAlign:"center",display:"inlineBlock",marginTop:40,marginBottom:0}} align="center" textAlign= "center">
              <h2 style={{display:"inline"}}>OR</h2>
          </div>
          
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:40,marginBottom:0}} align="center" textAlign= "center">
              <h4 style={{display:"inline"}}>Invite via Join Code:</h4>
          </div>
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:0,marginBottom:10}} align="center" textAlign= "center">
            <Typography style={{fontSize:"32px"}}>{data.joinCode.toUpperCase()}</Typography>
          </div>
          
        </>
      }
    </>
  );
}

export default InviteFriends;