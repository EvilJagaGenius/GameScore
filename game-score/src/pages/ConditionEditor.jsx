/**
 * Condition Editor - Jonathan Beels
 */

import React, { Component } from 'react'
import { Link } from "react-router-dom"
 
export default class ConditionEditor extends Component {
    constructor (props) {
        super(props);
        
        console.log("flag 2");
        console.log(this.props.location.state);
        this.state = {
            conditionID: this.props.location.state.conditionid,
            templateID: this.props.location.state.templateid,
            templateName: this.props.location.state.templatename,
            gameID: this.props.location.state.gameid,
            conditionName: "",
            scoringType:"",
            pointMultiplier: 0,
            inputType:"",
            maxPerGame: 0,
            maxPerPlayer: 0,
            description: "",
            loaded: false
        };
        
    }

    componentDidMount() {
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                conditionID: this.state.conditionID,
                templateID: this.state.templateID
            })
        }

        console.log(this.state.conditionID)

        fetch("/edit/condition", requestOptions)
           .then(res => res.json())
           .then(
               (result) => {
                   this.setState({
                        conditionName: result.conditionName,
                        scoringType: result.scoringType,
                        pointMultiplier: result.pointMultiplier,
                        inputType: result.inputType,
                        maxPerGame: result.maxPerGame,
                        maxPerPlayer: result.maxPerPlayer,
                        description: result.description,
                        loaded: true
                   });
               }
           )

           console.log(this.state);
    }

    handleSubmit = (event) =>{
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conditionID: this.state.conditionID,
                templateID: this.state.templateID,
                conditionName: this.state.conditionName,
                scoringType: this.state.scoringType,
                pointMultiplier: this.state.pointMultiplier,
                inputType: this.state.inputType,
                maxPerGame:this.state.maxPerGame,
                maxPerPlayer:this.state.maxPerPlayer,
                description: this.state.description
            })
        };

        console.log(this.state.conditionName)

        fetch('/edit/conditionValues', requestOptions)
        .then(response => response.json())
        .then((data) => {
            this.setState({ loaded: "True" });
            console.log(data);
        },)

        this.props.history.push({
            pathname: '/mytemplates/editor',
            state: {
                templateid: this.state.templateID,
                templatename: this.state.templateName,
                gameid: this.state.gameID
            }
        })
    }

    handleNameChange = (e) => {
        this.setState({conditionName: e.target.value});
    }

    handleScoreChange = (e) => {
        this.setState({scoringType: e.target.value});
    }

    handleMultiChange = (e) => {
        this.setState({pointMultiplier: e.target.value});
    }

    handleInputChange = (e) => {
        this.setState({inputType: e.target.value});
    }

    handleMaxGameChange = (e) => {
        this.setState({maxPerGame: e.target.value});
    }

    handleMaxPlayerChange = (e) => {
        this.setState({maxPerPlayer: e.target.value});
    }

    handleDescriptionChange = (e) => {
        this.setState({description: e.target.value});
    }

    handleDelete = (event) => {
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                conditionID: this.state.conditionID,
                templateID: this.state.templateID
            })
        }

        fetch("/edit/deleteCondition", requestOptions)
            .then(response => response.json())
            .then(data => {
                    this.setState({ loaded: "True" });
                    console.log(data);
            },)
        
        this.props.history.push({
            pathname: '/mytemplates/editor',
            state: {
                templateid: this.state.templateID,
                templatename: this.state.templateName,
                gameid: this.state.gameID
            }
        })
    }
    
    handleBack = (event) => {
        this.props.history.push({
            pathname: '/mytemplates/editor',
            state: {
                templateid: this.state.templateID,
                templatename: this.state.templateName,
                gameid: this.state.gameID
            }
        })
    }

    render() {
        
        return(
            <form onSubmit={this.handleSubmit}>
                
                <input type="button" value="Back" onClick={this.handleBack}/>
                <input type="text" id="conditionName" name="conditionName" placeholder="Condition Name" value={this.state.conditionName} onChange={this.handleNameChange} />
               
                <label htmlFor="scoringType">Scoring Type: </label>
                <select name="scoringType" id="scoringType" value={this.state.scoringType} onChange={this.handleScoreChange}>
                    <option value="">Choose a Type</option>
                    <option value="linear">Linear</option>
                    <option value="tabular">Tabular</option>
                </select><br/>

                <label htmlFor="pointMultiplier">Point Multiplier: </label>
                <input type="number" id="pointMultiplier" name="pointMultiplier" value={this.state.pointMultiplier} onChange={this.handleMultiChange} /><br/>
 
                <label htmlFor="inputType">Input Type: </label>
                <select name="inputType" id="inputType" value={this.state.inputType} onChange={this.handleInputChange}>
                    <option value="">Choose a Type</option>
                    <option value="increment">Increment</option>
                    <option value="textbox">Textbox</option>
                </select><br/>

                {/*<input type="checkbox" id="checkMaxPerGame" name="checkMaxPerGame" />*/}
                <label htmlFor="maxPerGame">Max # Per Game: </label>
                <input type="number" id="maxPerGame" name="maxPerGame" value={this.state.maxPerGame} onChange={this.handleMaxGameChange}/><br/>
               
                {/*<input type="checkbox" id="checkMaxPerPlayer" name="checkMaxPerPlayer"/>*/}
                <label htmlFor="maxPerPlayer">Max # Per Player: </label>
                <input type="number" id="maxPerPlayer" name="maxPerPlayer" value={this.state.maxPerPlayer} onChange={this.handleMaxPlayerChange}/>
                
                <label htmlFor="description">Description:</label><br/>
                <textarea value={this.state.descrition} onChange={this.handleDescriptionChange} placeholder="Give a brief description"/><br/>

                <input type="submit" onClick={this.handleSubmit} value="Save Condition"/>
                <input type="button" onClick={this.handleDelete} value="Delete Condition"/>
            </form>
        );
    }
};