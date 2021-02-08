import React, { useState, useEffect } from 'react';

function homeData() {
  //intialize data
  const [templateData, setTemplateData] = useState(0);

  //request data from flask server and assign data accordingly
  useEffect(() => {
    fetch('/api/getHomePage').then(res => res.json()).then(data => {
      setTemplateData(data);
    });
  }, []);

  return(templateData);
}

export default homeData;