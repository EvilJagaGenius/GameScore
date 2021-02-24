import React,  {useReducer, useState} from 'react'
import { Link, useHistory } from "react-router-dom"

const formReducer = (state, event) => {
    return {
      ...state,
      [event.name]: event.value
    }
}

export default function TemplateEditor(props) {
    const [data, setData] = useState({})

    const [loaded, setLoaded] = useState(false)
    
    fetch("/edit/") //Needs an actual route
        .then(res => res.json())
        .then(result => {
            setData(result);
            setLoaded(true)
        },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
        )

    return (
        <form>
            <input type="text" id="title" placeholder="Type the Title Here"/>
            <div className="conditionList">
                {Object.keys(data).map(key => (
                    <Link to="/mytemplates/conditioneditor" templateID={props.templateID} conditionID={data[key].conditionID}>
                        <table className="condition">
                            <tr>
                                <td>{data[key].conditionName}</td>
                            </tr>
                            <tr>
                                <td>{data[key].description}</td>
                            </tr>
                            <tr>
                                <td>Scoring Type: </td>
                                <td>{data[key].scoringType}</td>
                            </tr>
                            <tr>
                                <td>Points: </td>
                                <td>1x = {data[key].pointMultiplier}</td>
                            </tr>
                            <tr>
                                <td>Max # per Player: </td>
                                <td>{data[key].maxPerPlayer}</td>
                            </tr>
                            <tr>
                                <td>Max # per Game: </td>
                                <td>{data[key].maxPerGame}</td>
                            </tr>
                            <tr>
                                <td>Input Type: </td>
                                <td>{data[key].inputType}</td>
                            </tr>
                        </table>
                    </Link>
                ))}
            </div>
            <button type="submit" value="Upload Template"/>
            <button type="button" value="New Condition" />
        </form>
    )
 }