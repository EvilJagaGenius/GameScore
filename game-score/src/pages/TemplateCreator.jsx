import { FormInput } from "semantic-ui-react";
import React, { Component } from 'react';
import { useHistory } from "react-router-dom";

export default class TemplateCreator extends Component {
    state = {
        data:{},
        loaded:"False",
    }

    componentDidMount() {
        fetch("/api/createTemplate") //Needs an actual route
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                data: result,
                loaded: "True",
                newTemplate: 0
              }
              );
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
          )
    }

    handleInputChange(event) {
            const target = event.target;
            const value = target.value;
            const name = target.name;
        
            this.setState({
              [name]: value
            });
    }

    handleSubmit(event) {
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        };
        fetch('/edit/', requestOptions)
         .then(response => response.json())
         .then(data => this.setState({ 
             loaded: "True",
             newTemplate: data
         }))
 
        event.preventDefault();
        this.routeTemplateEditor();
    }

    routeTemplateEditor() {
        let path = '/mytemplates/templateeditor';
        let history = useHistory();
        history.push(path, this.state.newTemplate);
    }

    goBack() {
        let path = '/mytemplates';
        let history = useHistory();
        history.push(path);
    }

    render () {

        return (
            <form ref="form" onSubmit={this.handleSubmit}>
                <label for="gameName">Scoring Type: </label><br/>
                <select name="gameName" id="gameName" value={this.state.data.gameName} onChange={this.handleInputChange}>
                    {Object.keys(this.state.data).map(key => (
                        <option value={this.state.data[key].gameID}>{this.state.data[key].gameName}</option>
                    ))}
                </select><br/>
                
                <label for="templateName">Template Name: </label><br/>
                <input type="text" id="templateName" name="templateName" placeholder="Template Name" /><br/>
                <input type="submit">Create Template</input>
                <input type="button" onClick={this.goBack()}>Cancel</input>
            </form>
        )
    }
}