import React, { useState, useEffect } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export default function GameRow(props) {
        return(
          <TableRow rowPos={props.rowPos} accPos={props.accPos}>
            <TableCell><img src={props.pictureURL} style={{width: 64,  height:64}}/></TableCell>
            <TableCell>{props.gameName}</TableCell>
          </TableRow>
            );
}