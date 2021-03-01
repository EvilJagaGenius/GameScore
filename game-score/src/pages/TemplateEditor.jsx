import React,  {Component} from 'react'
import { Link, useHistory } from "react-router-dom"

export default class TemplateEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            templateID: this.props.location.state.templateID,
            templateName: this.props.location.state.templateName,
            data: {},
            loaded: false,
            newConditionID: 0
        }
    }
    
    componentDidMount() {
        fetch("/edit/") //Needs an actual route
            .then(res => res.json())
            .then(result => {
                this.setState({
                    data: result,
                    loaded: true
                })
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
            headers: {'content-Type': 'application/json'},
            body: JSON.stringify({
                newName: this.state.templateName
            })
        };

        this.props.history.push({
            pathname: "/mytemplates"
        })
    }

    handleNewCondition = (e) => {
        
        fetch('/edit/addCondition')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    loaded: true,
                    newConditionID: result.id
                })
            })

         this.props.history.push({
             pathname: "/mytemplates/conditioneditor",
             state: {
                templateID: this.state.templateID,
                conditionID: this.state.newConditionID
             }
         })
    }

    render() {

        return (

            <form>
                <input type="text" id="title" placeholder="Type the Title Here" value={this.state.templateName} onChange={this.handleNameChange}/>
                <div className="conditionList">
                    {Object.keys(this.state.data).map(key => (
                        <Link to="/mytemplates/conditioneditor" templateID={this.state.templateID} conditionID={this.state.data[key].conditionID}>
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
                <input type="button" value="Upload Template" onClick={this.handleSubmit}/>
                <input type="button" value="New Condition" onClick={this.handleNewCondition}/>
            </form>
        )
    }
}