import React, { useState, useEffect } from 'react';

export default function FavoritedData() {
  //intialize data
  const [templateData, setTemplateData] = useState([{}]);

  //request data from flask server and assign data accordingly
  useEffect(() => {
    fetch('/api/getHomePage').then(res => res.json()).then(data => {
      setTemplateData(data.favoritedTemplates[0]);
    });
  }, []);

  return(
    <div className="FavoritedData">
      <table>
        {templateData.map((template) => (
          <tr>
            <td><img src={template.pictureURL}/></td>
            <td>{template.templateName}</td>
            <td>{template.NumRatings}</td>
            <td>{template.averageRating}</td>
          </tr>
        ))}
      </table>  
    </div>
  );
}