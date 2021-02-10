/**
 * TemplateEditor.jsx - Jonathan Beels
 */

 import React, { Component } from 'react'

 export default class TemplateEditor extends Component {
    constructor (props) {
        super(props)
    }

    onSubmit = () => {
        fetch("")
    }

    createCondition() {
        
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
                    <button type="button" onClick={createCondition}>New Condition</button>
                </form>
            )
        }

        else {
            
        }
    }
 }