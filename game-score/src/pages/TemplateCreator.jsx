import { FormInput } from "semantic-ui-react";
import React from 'react';
import { useHistory } from "react-router-dom";

const [state, setState] = [{
    data:{},
    loaded:"False"
}]

function HandleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    state.setState({
      [name]: value
    });
}

function HandleSubmit(event) {
const requestOptions = {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
};
fetch('/edit/', requestOptions)
 .then(response => response.json())
 .then(data => state.setState({ 
     loaded: "True",
     newTemplate: data
 }))

RouteTemplateEditor();
}

function RouteTemplateEditor() {
let path = '/mytemplates/templateeditor';
let history = useHistory();
history.push(path, state.newTemplate);
}

function GoBack() {
let path = '/mytemplates';
let history = useHistory();
history.push(path);
}

export default function TemplateCreator() {

        fetch("/api/createTemplate") //Needs an actual route
          .then(res => res.json())
          .then(
            (result) => {
              state.setState({
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

    

        return (
          <div>
            <form ref="form" onSubmit={HandleSubmit()}>
                <label for="gameName">Scoring Type: </label><br/>
                <select name="gameName" id="gameName" value={state.data.gameName} onChange={HandleInputChange()}>
                    {Object.keys(state.data).map(key => (
                        <option value={state.data[key].gameID}>{state.data[key].gameName}</option>
                    ))}
                </select><br/>
                
                <label for="templateName">Template Name: </label><br/>
                <input type="text" id="templateName" name="templateName" placeholder="Template Name" /><br/>
                <input type="submit">Create Template</input>
                <input type="button" onClick={GoBack()}>Cancel</input>
            </form>
          </div>
        );
}