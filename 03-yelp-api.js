const sdk = require('api')('@yelp-developers/v1.0#420s3alobgub91');
const fs = require('fs');

const API_KEY = // get your own API key by creating a Yelp app

sdk.auth(`Bearer ${API_KEY}`);
sdk.v3_business_search({
  location: 'New%20York%20City',
  term: 'pizza',
  sort_by: 'best_match',
  limit: '20'
})
  .then(({ data }) => {
    //console.log(data)
    fs.writeFileSync('./data/pizza.json', JSON.stringify(data), 'utf-8');
  })
  .catch(err => console.error(err));