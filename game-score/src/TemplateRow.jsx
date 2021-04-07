import React, { useState, useEffect } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SportsEsports from '@material-ui/icons/SportsEsports';
import Modal from '@material-ui/core/Modal';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import { useHistory } from "react-router-dom";
import Star from '@material-ui/icons/Star';
import ImagePlaceholder from '@material-ui/icons/Casino';


export default function TemplateRow(props) {
        return(
        <>
                <TableCell style = {{width:125,padding:5}} align="left">
                  <img src={props.pictureURL} style={{width: 58,  height:58}}/>
                </TableCell>
                <TableCell align="left" style={{padding:5,width:"calc(100% - 130px)"}}>
                    <p style={{marginLeft:-55,fontSize:17}}>{props.templateName}</p>
                </TableCell>
                
                <TableCell align="right" style={{padding:5,width:80}}>
                  { (props.averageRating !== null) && (props.numRatings !== null) &&
                    <>
                    <div>
                     <div style ={{float:"right"}}>
                       <Star  style={{marginTop:2,position:"relative",width:32,height:32}} alt = "tempAlt" fontsize = "medium"></Star >
                      </div>
                      <div style={{float:"right",marginRight:5}}>
                          <p style={{fontSize:15, marginBottom:-3}}>{props.averageRating.toFixed(2)}</p>
                          <p style={{fontSize:12, marginTop:0}}>({props.numRatings})</p>
                      </div>
                    </div>
                    </>
                  }
                </TableCell>
          </>
        );
}
