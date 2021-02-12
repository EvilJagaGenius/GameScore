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
      {Object.keys(templateData).map(key => (
          <tr key={key}>
            <td><img src={templateData[key].pictureURL}/></td>
            <td>{templateData[key].templateName}</td>
            <td>{templateData[key].NumRatings}</td>
            <td>{templateData[key].averageRating}</td>
          </tr>
        ))}
    </table>  
  );
}