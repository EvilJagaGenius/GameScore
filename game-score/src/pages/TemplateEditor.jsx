/**
 * TemplateEditor.jsx - Jonathan Beels
 */

 import React from 'react'
 import { Link, useHistory } from "react-router-dom"

const [state, setState] = [{}]

 function Constructor (props) {
    state.setState({
        templateID: props.templateID,
        templateName: props.templateName,
        data: {},
        loaded: "False",
        newCondition: 0
    });
    HandleLoad();
}

function HandleLoad() {
    fetch("/edit/")
       .then(res => res.json())
       .then(
           (result) => {
               state.setState({
                   data: result,
                   loaded: "True"
               });
           }
       );
}

function HandleSubmit(event) {
    fetch("/edit/upload")
        .then(res => res.json())
        .then(
            (result) => {
                state.setState({
                    loaded:"True"
                })
            }
        )
    
    RouteToMyTemplates();
}

function CreateCondition() {
    fetch("/edit/addCondition")
        .then(res => res.json())
        .then(
            (result) => {
                state.setState({
                    loaded: "True",
                    newCondition: result
                });
            }
        );

    RouteToConditionEditor();
}

function RouteToConditionEditor() {
    let path = '/mytemplates/conditioneditor';
    let history = useHistory();
    history.push(path, state.newCondition);
}

function RouteToMyTemplates() {
    let path = '/mytemplates';
    let history = useHistory();
    history.push(path);
}

 export default function TemplateEditor(props) {
    Constructor(props);
    const edit = this.props.edit;

        return (
                
            <form ref="form" onSubmit={HandleSubmit()}>
                <input type="text" id="title" name="title" placeholder="Type the Title Here" value={state.templateName}/>
                <div className="Condition list">
                    {Object.keys(this.state.data).map(key => (
                        <Link to="/mytemplates/conditioneditor" templateID={state.templateID} conditionID={state.data[key].conditionID}>
                            <table className="Condition">
                                <tr>
                                    <td>{state.data[key].conditionName}</td>
                                </tr>
                                <tr>
                                    <td>{state.data[key].description}</td>
                                </tr>
                                <tr>
                                    <td>Scoring Type: </td> 
                                    <td>{state.data[key].scoringType}</td>
                                </tr>
                                <tr>
                                    <td>Points: </td>
                                    <td>1x = {state.data[key].pointMultiplier}</td>
                                </tr>
                                <tr>
                                    <td>Max # per Player: </td>
                                    <td>{state.data[key].maxPerPlayer}</td>
                                </tr>
                                <tr>
                                    <td>Max # per Game: </td>
                                    <td>{state.data[key].maxPerGame}</td>
                                </tr>
                                <tr>
                                    <td>Input Type: </td>
                                    <td>{state.data[key].inputType}</td>
                                </tr>
                            </table>
                        </Link>
                    ))}
                </div>
                <button type="submit" onClick={RouteToMyTemplates()}>Upload Template</button>
                <button type="button" onClick={CreateCondition()}>New Condition</button>
            </form>
            )
        }