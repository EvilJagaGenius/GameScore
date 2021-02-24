import React, { useState, useReducer } from 'react';
import { useHistory } from "react-router-dom";

const [state, setState] = [{
    data:{},
    loaded:"False"
}]

const formReducer = (state, event) => {
  return {
    ...state,
    [event.target.name]: event.target.value
  }
}



/**
function HandleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    state.setState({
      [name]: value
    });
}
*/  

/**
function RouteTemplateEditor() {
  let path = '/mytemplates/editor';
  let history = useHistory();
  history.push(path, state.newTemplate);
}

function GoBack() {
  let path = '/mytemplates/menu';
  let history = useHistory();
  history.push(path);
}
*/

export default function TemplateCreator() {

  fetch("/api/createTemplate") //Needs an actual route
    .then(res => res.json())
    .then(
      (result) => {
        state.setState({
          data: result,
          loaded: "True",
          newTemplate: 0
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
    )


  const handleChange = event => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  }

  const GoBack = () => {
    state.setState({
      path: "/mytemplates"
    })
    let history = useHistory();
    history.push(path);
  }

  const [formData, setFormData] = useReducer(formReducer, {});

  const HandleSubmit = () => {
    const requestOptions = {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };
    fetch('/edit/', requestOptions)
      .then(response => response.json())
      .then(data => state.setState({ 
        loaded: "True",
        newTemplate: data
      }))
      
      state.setState({
        path:"/mytemplates/editor"
      });
      let history = useHistory();
      history.push(path, state.newTemplate);
  }
  
  /*
  const RouteTemplateEditor = () => {
    let path = '/mytemplates/editor';
    let history = useHistory();
    history.push(path, state.newTemplate);
  }
  */

  return (
    <div>
      <form ref="form" onSubmit={HandleSubmit}>
        <label for="gameName">Scoring Type: </label><br/>
        <select name="gameName" id="gameName" value={formData.gameName || ''} onChange={handleChange}>
          {Object.keys(state.data).map(key => (
            <option value={state.data[key].gameID}>{state.data[key].gameName}</option>
          ))}
        </select><br/>
                
        <label for="templateName">Template Name: </label><br/>
        <input type="text" id="templateName" name="templateName" placeholder="Template Name" onChange={handleChange} value={formData.templateName || ''} /><br/>
        <input type="submit">Create Template</input>
        <input type="button" onClick={GoBack}>Cancel</input>
      </form>
    </div>
  );
}