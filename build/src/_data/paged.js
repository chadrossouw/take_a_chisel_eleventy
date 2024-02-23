const {getCacheOrFetch,getCacheAndFetchSingleItem,sortByDate} = require('../../utilities/utilities.js');

const id = process.env.npm_config_id;
const type = process.env.npm_config_type;
const breakCache = process.env.npm_config_break_cache;
const cacheFile = '../cache/pages.json';

module.exports = async function(){
  let pagesJson;
  if(type=='page'&&id){
    try {
      pagesJson = await getCacheAndFetchSingleItem(cacheFile,id,breakCache);
      return sortByDate(pagesJson);
    }
    catch(e){
      console.log(e.message);
    }
  }
  else{
    try{
        pagesJson = await getCacheOrFetch(cacheFile,'page',breakCache);
        return sortByDate(pagesJson);
    }
    catch(e){
      console.log(e.message);
    }
  }

};