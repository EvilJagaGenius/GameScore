import React, { useState, useEffect } from 'react';

export default function FavoritedData() {
  //intialize data
  const [templateData, setTemplateData] = useState([{}]);

  //request data from flask server and assign data accordingly
  useEffect(() => {
    fetch('/api/getHomePage').then(res => res.json()).then(data => {
      setTemplateData(data.favoritedTemplates);
    });
  }, []);

  return(
    <div className="FavoritedData">
      <table>
        {/* Iterate through favorited templates and render the data in a tabular format */}
        {Object.keys(templateData).map(key => (
          <tr key={key}>
            <td><img src={templateData[key].pictureURL}/></td>
            <td>{templateData[key].templateName}</td>
            <td>{templateData[key].NumRatings}</td>
            <td>{templateData[key].averageRating}</td>
          </tr>
        ))}
      </table>  
    </div>
  );
}