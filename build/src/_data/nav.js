const {getCacheOrFetch} = require('../../utilities/utilities.js');

const cacheFile = '../cache/nav.json';

module.exports = async function(){
  let navJson;
    try{
        navJson = await getCacheOrFetch(cacheFile,'nav');
        return navJson;
    }
    catch(e){
        console.log(e.message);
    }
};