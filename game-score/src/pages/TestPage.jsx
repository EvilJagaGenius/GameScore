import React, {Component} from 'react';

export default class TestPage extends Component{

    constructor(props){
        super(props)
        this.state = {
            templateID: this.props.state.templateID
        }
        console.log(this.props.state.templateID)
    }

    render () {
        
        return(
            <h1>Successfully Routed </h1>
        )
    }
}