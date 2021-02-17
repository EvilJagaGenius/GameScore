/**
 * Condition Editor - Jonathan Beels
 */

import React, { Component } from 'react'
import { Link } from "react-router-dom"
 
export default class ConditionEditor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            conditionID: this.props.conditionID,
            templateID: this.props.templateID,
            data: {},
            loaded:"False"
        };
        this.handleLoad();
    }

    handleLoad() {
        fetch("/edit/condition")
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

    handleSubmit(event) {
       const requestOptions = {
           method:'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(this.state)
       };


    }

    handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    }

    handleDelete(event) {
        fetch("/edit/deleteCondition").then
    }

    render() {
        
        return(
            <form ref="form" onSubmit={this.handleSubmit}>
                <Link to="/mytemplates/templateeditor">
                    <input type="button">Back</input>
                </Link>
                <input type="text" id="conditionName" name="conditionName" placeholder="Condition Name" value={this.state.data.conditionName} onChange={this.handleInputChange} />
               
                <label for="scoringType">Scoring Type: </label>
                <select name="scoringType" id="scoringType" value={this.state.data.scoringType} onChange={this.handleInputChange}>
                    <option value="linear">Linear</option>
                    <option value="tabular">Tabular</option>
                </select><br/>

                <label for="pointMultiplier">Points: </label>
                <input type="number" id="pointMultiplier" name="pointMultiplier" value={this.state.data.pointMultiplier} onChange={this.handleInputChange} /><br/>
 
                <label for="inputType">Input Type: </label>
                <select name="inputType" id="inputType" value={this.state.data.inputType} onChange={this.handleInputChange}>
                    <option value="increment">Increment</option>
                    <option value="textbox">Textbox</option>
                </select><br/>

                {/* <input type="checkbox" id="checkMaxPerGame" name="checkMaxPerGame" checked= /> */}
                <label for="maxPerGame">Max # Per Game: </label>
                <input type="number" id="maxPerGame" name="maxPerGame" value={this.state.data.maxPerGame} onChange={this.handleInputChange}/><br/>
               
                {/* <input type="checkbox" id="checkMaxPerPlayer" name="checkMaxPerPlayer" /> */}
                <label for="maxPerPlayer">Max # Per Player: </label>
                <input type="number" id="maxPerPlayer" name="maxPerPlayer" value={this.state.data.maxPerPlayer} onChange={this.handleInputChange}/>
                
                <label for="description">Description:</label><br/>
                <input type="text" id="description" name="description" placeholder="Give a brief description" /><br/>

                <Link to="/mytemplates/templateeditor">
                    <input type="submit">Save Condition</input>
                </Link>
                <Link to="/mytemplates/templateeditor">
                    <input type="button" onClick={this.handleDelete}>Delete Condition</input>
                </Link>
            </form>
        );
    }
}