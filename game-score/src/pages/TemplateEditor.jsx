/**
 * TemplateEditor.jsx - Jonathan Beels
 */

 import React, { Component } from 'react'
 import { Link } from "react-router-dom"

 export default class TemplateEditor extends Component {
    constructor (props) {
        super(props)
        this.state= {
            templateID: this.props.templateID,
            templateName: this.props.templateName,
            data: {},
            loaded: "False"
        };
        this.handleLoad();
    }

    handleLoad() {
        fetch("/edit/")
           .then(res => res.json())
           .then(
               (result) => {
                   this.setState({
                       data: result,
                       loaded: "True"
                   });
               }
           )
    }
    /**
    onSubmit = () => {
        fetch("")
    }
    */ 

    createCondition() {
        fetch("")
    }

    render() {
        const edit = this.props.edit;

        if (edit == 0) {
            return (
                
                <form ref="form" onSubmit={this.handleSubmit}>
                    <input type="text" id="title" name="title" placeholder="Type the Title Here" value={this.state.templateName}/>
                    <div className="Condition list">
                        {Object.keys(this.state.data).map(key => (
                            <Link to="/mytemplates/conditioneditor" templateID={this.templateID} conditionID={this.state.data[key].conditionID}>
                                <table className="Condition">
                                    <tr>
                                        <td>{this.state.data[key].conditionName}</td>
                                    </tr>
                                    <tr>
                                        <td>{this.state.data[key].description}</td>
                                    </tr>
                                    <tr>
                                        <td>Scoring Type: </td> 
                                        <td>{this.state.data[key].scoringType}</td>
                                    </tr>
                                    <tr>
                                        <td>Points: </td>
                                        <td>1x = {this.state.data[key].pointMultiplier}</td>
                                    </tr>
                                    <tr>
                                        <td>Max # per Player: </td>
                                        <td>{this.state.data[key].maxPerPlayer}</td>
                                    </tr>
                                    <tr>
                                        <td>Max # per Game: </td>
                                        <td>{this.state.data[key].maxPerGame}</td>
                                    </tr>
                                    <tr>
                                        <td>Input Type: </td>
                                        <td>{this.state.data[key].inputType}</td>
                                    </tr>
                                </table>
                            </Link>
                        ))}
                    </div>
                    <button type="submit">Upload Template</button>
                    <Link to="/mytemplates/conditioneditor" >
                        <button type="button" onClick={createCondition()}>New Condition</button>
                    </Link>
                </form>
            )
        }

        else {
            
        }
    }
 }