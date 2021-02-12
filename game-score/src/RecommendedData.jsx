import React, { useState, useEffect } from 'react';

export default function RecommendedData() {
  //intialize data
  const [gameData, setTemplateData] = useState([{}]);

  //request data from flask server and assign data accordingly
  useEffect(() => {
    fetch('/api/getHomePage').then(res => res.json()).then(data => {
      setTemplateData(data.recommendedGames);
    });
  }, []);

  return(
    <table>
      {Object.keys(gameData).map(key => (
          <tr key={key}>
            <td><img src={gameData[key].pictureURL}/></td>
            <td>{gameData[key].templateName}</td>
          </tr>
        ))}
    </table>  
  );
}