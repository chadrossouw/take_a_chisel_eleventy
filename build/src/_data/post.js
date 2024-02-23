const {getCacheOrFetch,getCacheAndFetchSingleItem,sortByDate,addCategoryData} = require('../../utilities/utilities.js');

const id = process.env.npm_config_id;
const type = process.env.npm_config_type;
const breakCache = process.env.npm_config_break_cache;
const cacheFile = '../cache/posts.json';

module.exports = async function(){
  let postsJson;
  let categories;
  if(type=='post'&&id){
    try {
      postsJson = await getCacheAndFetchSingleItem(cacheFile,id,breakCache);
      postsJson = sortByDate(postsJson);
      categories = addCategoryData(postsJson);
      return {posts:postsJson,categories:categories};
    }
    catch(e){
      console.log(e.message);
    }
  }
  else{
    try{
        postsJson = await getCacheOrFetch(cacheFile,'post',breakCache);
        postsJson = sortByDate(postsJson);
        categories = addCategoryData(postsJson);
        return {posts:postsJson,categories:categories};
    }
    catch(e){
      console.log(e.message);
    }
  }

};