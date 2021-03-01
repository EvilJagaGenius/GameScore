import React, {Component} from 'react';
import {Link} from 'react-router-dom';

/*
const formReducer = (state, event) => {
    return {
      ...state,
      [event.name]: event.value
    }
}
*/

export default class TemplateCreator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameID: 0,
            templateName: "",
            cloneID: 0,
            templateID: 0,
            games: {},
            templates: {},
            loaded: false
        }
    }
    /*
    const [data, setData] = useState({}) 

    const [loaded, setLoaded] = useState(false)

    const [newTemplate, setNewTemplate] = useState(0)

    const [formData, setFormData] = useState({
        gameID: null,
        templateName: "",
        cloneID: null
    });

    const [path, setPath] = useState("/mytemplates/editor")
    
    const [edit, setEdit] = useState(false)

    const [templates, setTemplates] = useState({})
    */

    handleSubmit = (e) => {
        
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gameID: this.state.gameID,
                templateName: this.state.templateName,
                cloneID: this.state.cloneID
            })
        };

        //const response = await fetch('/newTemplate/', requestOptions);
        //const data = await response.json();
        console.log(requestOptions);
        this.props.history.push({
            pathname: "/testpaage",
            state: this.state.templateID
        });
        /*
        fetch('/newTemplate/', requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoaded(true)
                setNewTemplate(result)
                setEdit(false)
            },)
        
        let history = useHistory();
        history.pushState(path, [newTemplate, edit]);
        */
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
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
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
                    <option value={0}>-- Do not clone --</option>
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