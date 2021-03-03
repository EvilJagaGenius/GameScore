import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class TemplateCreator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameID: 0,
            templateName: "",
            cloneID: -1,
            games: {},
            templates: {},
            loaded: false
        }
    }

    handleSubmit = (e) => {
        
        const requestOptions = {
            method:'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                gameID: this.state.gameID,
                templateName: this.state.templateName,
                cloneID: this.state.cloneID
            })
        };

        
        fetch('/newTemplate/', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({templateID: result.id, loaded: true},
                    this.pushEditor);
                console.log(this.state.loaded);
                console.log(this.state.templateID)
            },)
        

        console.log(this.state.templateID);
        
    }

    pushEditor = () => {
        this.props.history.push({
            pathname: "/mytemplates/editor",
            state: {
                templateid: this.state.templateID,
                templatename: this.state.templateName,
                gameid: this.state.gameID
            }
        });
    }

    handleGameChange = e => {
        this.setState({gameID: e.target.value});
    }

    handleNameChange = e => {
        this.setState({templateName: e.target.value});
    }

    handleCloneChange = e => {
        this.setState({cloneID: e.target.value});
    }

    componentDidMount(){
        fetch("/edit/templateGameList") //Needs an actual route
            .then(res => res.json())
            .then(
                result => {
                    console.log(result.games);
                    this.setState({
                        games: result.games,
                        templates: result.templates,
                        loaded: true
                    });
                }
            )
    }

    handlePrint = e => {
        console.log(this.state.gameID);
        console.log(this.state.templateName);
        console.log(this.state.cloneID);
    }
    
    render() {

        return (
    
            <form>
                <label for="gameName">Choose a Game: </label><br/>
                <select name="gameName" id="gameName" onChange={this.handleGameChange}>
                    <option value={0}>Choose a Game</option>
                    {this.state.loaded === true &&
                        <>
                            {Object.keys(this.state.games).map(key => (
                                <option value={this.state.games[key].gameID}>{this.state.games[key].gameName}</option>
                            ))}
                        </>
                    }
                </select><br/>
                    
                <label for="templateName">Template Name: </label><br/>
                <input type="text" id="templateName" name="templateName" placeholder="Template Name" onChange={this.handleNameChange} /><br/>
            
                <label for="clone">Clone a template:</label><br/>
                <select name="clone" id="clone" onChange={this.handleCloneChange} >
                    <option value={-1}>-- Do not clone --</option>
                    {this.state.loaded === true &&  
                        <>  
                            {Object.keys(this.state.templates).map(key => (
                                <option value={this.state.templates[key].templateID}>{this.state.templates[key].templateName}</option>
                            ))}
                        </>
                    }
                </select><br/>

                <input type="button" value="Create Template" onClick={this.handleSubmit}/>
                <Link to="/mytemplates/">
                    <input type="button" value="Cancel"/>
                </Link>
             </form>
        
        );
    }
};