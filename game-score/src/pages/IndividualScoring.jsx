/**
 * IndividualScoring.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code
 */

//import resources
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  
  function createData(condition, value, score) {
    return { condition, value, score};
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Eclair', 262, 16.0),
  ];

//create component
export default function IndividualScoring(props){
    console.log(props.location.state.message);
    const classes = useStyles();
    const history = useHistory();
    return(
    <div>
      <Button onClick={()=>history.goBack()}>Back</Button>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Condition</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="center">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.condition}</TableCell>
                <TextField id="outlined-basic" label="" variant="outlined" />
                <TableCell align="left">{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}