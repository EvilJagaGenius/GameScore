import React from 'react';

export default function TemplateCreator() {
    return (
        <>
          <form>
            <label for="gameName">Scoring Type: </label><br/>
            <select name="gameName" id="gameName">
              
            </select><br/>
                    
            <label for="templateName">Template Name: </label><br/>
            <input type="text" id="templateName" name="templateName" placeHolder="Template Name" /><br/>
            <input type="submit">Create Template</input>
            <input type="button">Cancel</input>
          </form>
        </>
      );
}