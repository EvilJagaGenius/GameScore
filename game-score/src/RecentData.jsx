import React, { useState, useEffect } from 'react';

export default function RecentData() {
  //intialize data
  const [templateData, setTemplateData] = useState([{}]);

  //request data from flask server and assign data accordingly
  useEffect(() => {
    fetch('/api/getHomePage').then(res => res.json()).then(data => {
      setTemplateData(data.recentlyPlayed);
    });
  }, []);

  return(
    <table>
      {templateData.map(template => (
        <tr>
            <td>{template.pictureURL}</td>
            <td>{template.templateName}</td>
            <td>{template.NumRatings}</td>
            <td>{template.averageRating}</td>
        </tr>
      ))}
    </table>  
  );
}