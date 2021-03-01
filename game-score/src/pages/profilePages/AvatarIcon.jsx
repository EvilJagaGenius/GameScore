import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

export default class AvatarIcon extends React.Component{
    render(){
        const classes = makeStyles((theme) => ({
            root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
            },
            small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            },
            large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
            },
        }));
        return(
            <Avatar alt="avatar-icon" src="/images/astronaut.png" className={classes.large}></Avatar>
        );
    }
}