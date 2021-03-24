import React, { useState, useEffect } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ImagePlaceholder from '@material-ui/icons/Casino';

export default function GameRow(props) {
        return(
          <TableRow>
            <TableCell style = {{width:125,padding:5}} align="left">
            	<img src={props.pictureURL} style={{width: 58,  height:58}}/>
            </TableCell>
            <TableCell align="left" style={{padding:5}}>
            	<p style={{marginLeft:-65,fontSize:17}}>{props.gameName}</p>
            </TableCell>
          </TableRow>
            );
}