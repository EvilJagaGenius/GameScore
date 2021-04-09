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
import Avatars from'./pages/profilePages/Avatars';

export default function UserRow(props) {
    return(
    <>
            <TableCell style = {{width:125,padding:5}} align="left">
              <img alt="avatar" src={<Avatars avatarID={props.avatarID} /> } style={{width: 58,  height:58}}/>
            </TableCell>
            <TableCell align="left" style={{padding:5,width:"calc(100% - 130px)"}}>
                <p style={{marginLeft:-55,fontSize:17}}>{props.userName}</p>
            </TableCell>
      </>
    );
}