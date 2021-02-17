/**
 * Condition Editor - Jonathan Beels
 */

 import React, { Component } from 'react'
 
 export default class ConditionEditor extends Component {
     constructor (props) {
         super(props);
     }

     onLoad() {
         fetch("")
     }

     render() {
        const conditionID = this.props.conditionID;
        const gameID = this.props.gameID;
        const templateID = this.props.templateID;
        return(
            <form ref="form" onSubmit={this.handleSubmit}>
                <Link to="/mytemplates/templateeditor">
                    <input type="button">Back</input>
                </Link>
                <input type="text" id="conditionName" name="conditionName" placeholder="Condition Name" />
                
                <label for="scoringType">Scoring Type: </label>
                <select name="scoringType" id="scoringType">
                    <option value="linear">Linear</option>
                    <option value="tabular">Tabular</option>
                </select><br/>

                <label for="pointMultiplier">POints: </label>
                <input type="number" id="pointMultiplier" name="pointMultiplier" value="1" /><br/>

                <label for="inputType">Input Type: </label>
                <select name="inputType" id="inputType">
                    <option value="increment">Increment</option>
                    <option value="textbox">Textbox</option>
                </select><br/>

                <input type="checkbox" id="checkMaxPerGame" name="checkMaxPerGame" />
                <label for="checkMaxPerGame">Max # Per Game: </label>
                <input type="number" id="maxPerGame" name="maxPerGame" /><br/>
                
                <input type="checkbox" id="checkMaxPerPlayer" name="checkMaxPerPlayer" />
                <label for="checkMaxPerPlayer">Max # Per Player: </label>
                <input type="number" id="maxPerPlayer" name="maxPerPlayer"/>
                
                <label for="description">Description:</label><br/>
                <input type="text" id="description" name="description" placeholder="Give a brief description" /><br/>

                <input type="button">Save Condition</input>
                <Link to="/mytemplates/templateeditor">
                    <input type="button">Delete Condition</input>
                </Link>
            </form>
        );
     }
 }