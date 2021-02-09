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
      {gameData.map(game => (
        <tr>
            <td>{game.pictureURL}</td>
            <td>{game.gameName}</td>
        </tr>
      ))}
    </table>  
  );
}