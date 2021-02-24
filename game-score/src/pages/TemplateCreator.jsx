import React, {useReducer, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

const formReducer = (state, event) => {
    return {
      ...state,
      [event.name]: event.value
    }
}

export default function TemplateCreator() {
    const [data, setData] = useState({}) 

    const [loaded, setLoaded] = useState(false)

    const [newTemplate, setNewTemplate] = useState(0)

    const [formData, setFormData] = useReducer(formReducer, {});

    const [path, setPath] = useState("/mytemplates/editor")
    
    const [edit, setEdit] = useState(false)

    const [templates, setTemplates] = useState({})

    const HandleSubmit = event => {
        event.preventDefault();
        alert('You have submitted the form.')

        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };
        /*
        fetch('/newTemplate/', requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoaded(true)
                setNewTemplate(result)
                setEdit(false)
            },)
        */
        let history = useHistory();
        history.pushState(path, [newTemplate, edit]);
    }

    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    fetch("/edit/templateGameList") //Needs an actual route
        .then(res => res.json())
        .then(
            result => {
                setData(result.games);
                setTemplates(result.templates)
                setLoaded(true)
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
        )
      
    return (
        
        <>
          <form onSubmit={HandleSubmit}>
            <label for="gameName">Choose a Game: </label><br/>
            <select name="gameName" id="gameName" onChange={handleChange} value={formData.gameName || ""}>
                {Object.keys(data).map(key => (
                    <option value={data[key].gameID}>{data[key].gameName}</option>
                ))}
            </select><br/>
                    
            <label for="templateName">Template Name: </label><br/>
            <input type="text" id="templateName" name="templateName" placeHolder="Template Name" onChange={handleChange} value={formData.templateName || ""}/><br/>
            /*
            <label for="templateName">Clone a template:</label><br/>
            <select name="templateName" id="templateName" onChange={handleChange} value={formData.templateName || null}>
                <option value={null}>-- Do not clone --</option>
                {Object.keys(templates).map(key => (
                    <option value={templates[key].templateID}>{templates[key].templateName}</option>
                ))}
            </select><br/>

            <input type="submit" value="Create Template"/>
            <Link to="/mytemplates/">
                <input type="button" value="Cancel"/>
            </Link>
          </form>
        </>
      );
}