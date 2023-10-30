const fs = require('fs');
const axios = require('axios');

// Promises approach to fetching data from a remote URL
function getJSON() {
  return new Promise( function(resolve) {
    axios.get('https://jsonplaceholder.typicode.com/users')
         .then( json => {
          console.log(json);
         }).error(
          console.log('error')
         );
  })
}

async function getJSONAsync() {
  const json = await axios.get('https://jsonplaceholder.typicode.com/users')

  console.log(json);
}

// getJSON();
getJSONAsync();