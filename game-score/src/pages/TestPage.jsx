import React, {Component} from 'react';
import TemplateEditor from './TemplateEditor';

export default class TestPage extends Component{

    constructor(props){
        super(props)
        this.state = {
            templateID: this.props.location.state.templateID
        }
    }

    componentDidMount() {
        console.log(this.state.templateID)
    }
    render () {
        
        return(
            <div>
                <h1>Successfully Routed</h1><br/>
                <h2>Template ID is {this.state.templateID}</h2>
            </div>
            
        )
    }
}