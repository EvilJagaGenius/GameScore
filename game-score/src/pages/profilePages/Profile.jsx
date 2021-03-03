import React from "react";
import {Button} from "@material-ui/core";
import { BrowserRouter as Router, Link } from 'react-router-dom';

export default class Profile extends React.Component{
    constructor(props){
        super();
    }
    render(){
        return(
            <div>
                <Button><Link to="/profile/editaccount">Edit Account</Link></Button>
            </div>
        );
    }
}