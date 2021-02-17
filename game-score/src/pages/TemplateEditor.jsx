/**
 * TemplateEditor.jsx - Jonathan Beels
 */

 import React, { Component } from 'react'
 import { Link } from "react-router-dom"

 export default class TemplateEditor extends Component {
    constructor (props) {
        super(props)
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
                    <input type="text" id="title" name="title" placeholder="Type the Title Here" />
                    <div className="Condition list">
                    </div>
                    <button type="submit">Upload Template</button>
                    <Link to="/mytemplates/conditioneditor">
                        <button type="button" onClick={createCondition()}>New Condition</button>
                    </Link>
                </form>
            )
        }

        else {
            
        }
    }
 }