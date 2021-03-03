import React,  {Component} from 'react'
import { Link, useHistory } from "react-router-dom"

export default class TemplateEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            templateID: this.props.location.state.templateid,
            templateName: this.props.location.state.templatename,
            gameID: this.props.location.state.gameid,
            data: {},
            loaded: false,
            conditionID: 0
        }
    }
    
    componentDidMount() {

        console.log(this.state.templateID)
        const requestOptions = {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                templateID: this.state.templateID
            })
        };

        fetch("/edit/", requestOptions) //Needs an actual route
            .then(res => res.json())
            .then(result => {
                this.setState({
                    data: result,
                    loaded: true
                })
                console.log(result)
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
            )
    }

    handleNameChange = (e) =>{
        this.setState({templateName: e.target.value})
    }

    handleSubmit = (e) =>{
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                templateID: this.state.templateID,
                newName: this.state.templateName
            })
        };

        fetch("/edit/name", requestOptions)
            .then(res => res.json())
            .then(result => {
                this.setState({
                    loaded: true
                })
            })

        this.props.history.push({
            pathname: "/mytemplates"
        })
    }

    handleNewCondition = (e) => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                templateID: this.state.templateID,
                gameID: this.state.gameID
            })
        }
        
        fetch('/edit/addCondition', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.id)
                console.log(result);
                this.setState({
                    loaded: true,
                    conditionID: result.id
                }, this.pushCondition)
            },)         
    }

    pushCondition = () => {

        console.log(this.state.conditionID);
        this.props.history.push({
            pathname: "/mytemplates/conditioneditor",
            state: {
               templateid: this.state.templateID,
               conditionid: this.state.conditionID,
               gameid: this.state.gameID
            }
        })
    }

    handleBack = (e) => {
        this.props.history.push({
            pathname:"/mytemplates"
        })
    }

    handleEdit = (e) => {
        
    }

    render() {

        return (

            <form>
                <input type="button" value="Back" onClick={this.handleBack}/><br/>
                <input type="text" id="title" placeholder="Type the Title Here" value={this.state.templateName} onChange={this.handleNameChange}/>
                <div className="conditionList">
                    {Object.keys(this.state.data).map(key => (
                        <div onClick={() => {
                            this.props.history.push({
                                pathname:"/mytemplates/conditioneditor",
                                state: {
                                    templateid: this.state.templateID,
                                    conditionid: this.state.data[key].conditionID,
                                    templatename: this.state.templateName
                                }
                            })
                        }}>
                            {console.log(this.state.data[key].conditionID)}
                            <table className="condition">
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
                                    <td>1x = {this.state.data[key].inputType}</td>
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
                                    <td>{this.state.data[key].pointMultiplier}</td>
                                </tr>
                            </table>
                        </div>
                    ))}
                </div>
                <input type="button" value="Upload Template" onClick={this.handleSubmit}/>
                <input type="button" value="New Condition" onClick={this.handleNewCondition}/>
            </form>
        )
    }
}