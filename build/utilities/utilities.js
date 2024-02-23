const fetch = require('node-fetch');
const fs = require('fs').promises;
const { DateTime } = require('luxon');
const { url } = require('inspector');

const getCacheOrFetch = async (cacheFile,type,breakCache=null) =>{
  console.log("Getting cache file...");
  let itemsJson = {};
  try{
    if(breakCache!==null){
      throw new Error('Breaking cache');
    }
    const cacheFileRaw = await fs.readFile(cacheFile);
    const cacheJson = JSON.parse(cacheFileRaw);
    const dateNow = DateTime.now();
    const cacheDate = DateTime.fromISO(cacheJson.cacheDate);
    
    if(dateNow>cacheDate){
      console.log('Cache is old.');
      try{
        itemsJson = await getItems(type);
        if(itemsJson.error !== undefined){
          throw new Error(itemsJson.error);
        }
        console.log('Got new items');
        await writeCache(cacheFile,itemsJson);
      }
      catch(e){
        throw e;
      }
    }
    else{

      itemsJson = cacheJson.items;
      if(itemsJson){
        console.log('Cache is valid');
      }
      else{
        throw new Error('Cache is empty');
      }
    }
  }
  catch(e){
    console.log(e.message);
    try{
      itemsJson = await getItems(type);
      if(itemsJson.error !== undefined){
        throw new Error(itemsJson.error);
      }
      await writeCache(cacheFile,itemsJson);
    }
    catch(e){
      throw e;
    }
  }
  return itemsJson;
}

const getCacheAndFetchSingleItem = async (cacheFile,id,breakCache=null) => {
    console.log(`Getting item with id ${id}`);
    let itemsJson = {};
    try {
        if(breakCache!==null){
          throw new Error('Breaking cache');
        }
        const cacheFileRaw = await fs.readFile(cacheFile);
        const cacheJson = JSON.parse(cacheFileRaw);

        try{
            itemsJson = cacheJson.items;
            if(itemsJson[id]!==undefined){
            itemsJson[id] = await getItem(id);
            await writeCache(cacheFile,itemsJson);
            }
        }
        catch(e){
            throw e;
        }
    }
    catch{
        console.log('No cache file, fetching everything instead');
        try{
            itemsJson = await getItems(type);
            if(itemsJson.error !== undefined){
                throw new Error(itemsJson.error);
            }
            console.log('Got new items');
            await writeCache(cacheFile,itemsJson);
        }
        catch(e){
            throw e;
        }
    }
    return itemsJson;
}

const getItems = async (type) => {
  console.log("Fetching data...");
  let itemsJson = {};
  let maxItems = 0;
  let currentPage = 1;
  let loop = true;
  let baseurl;
  if(type=='nav'){
    baseurl = `${process.env.RESTURL}get_menu`;
  }
  else{
    baseurl = `${process.env.RESTURL}get_items?type=${type}`;
  }
  while(loop){
      try{
        let url;
        if(type=='nav'){
          url = baseurl;
          console.log(url);
        }
        else{
          url = `${baseurl}&page=${currentPage}`;
        }
        const res = await fetch(url);
        
        if(res.status!==200){
          throw new Error(res.statusText);
        }
        let json = await res.json();
        if(type=='nav'){
          loop = false;
        }
        else{
          if(!maxItems){
            maxItems = json.totalItems
          }
          if((maxItems/10)<currentPage){
            loop = false;
          }
        }
        itemsJson={...itemsJson,...json.items};
        currentPage++;
      }
      catch(e){
        console.log(e.message);
        return {error:e.message};
      }
  }
  return itemsJson;
};

const getItem = async (id) =>{
  console.log(`Fetching item with id ${id}`);
  const res = await fetch(`${process.env.RESTURL}?id=${id}`);
  let json = await res.json();
  console.log(json);
  return json.items[id];
}

const writeCache = async (cacheFile,content) => {
  console.log('Attempting to write to cache file');
  try{
    content = {
      cacheDate: DateTime.now().plus({hours:1}).toString(),
      items:content,
    }
    const cache = await fs.writeFile(cacheFile,JSON.stringify(content));
  }
  catch(e){
    console.log(e);
  }
}

const sortByDate = (json) => {
  return Object.values(json).sort((a,b)=>{ 
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    if(a.slug > b.slug){
      return -1
    }
    if(a.slug < b.slug){
      return 1
    }
    return 0
  });
}

const addCategoryData = (posts) => {
    console.log('Parsing categories');
    let allCategories = {};
    let categoryPagesCount = {};
    posts.forEach(post => {
      let categories = post.category;
      categories.forEach(category => {
        if(category == ''||category == 'Uncategorized'){
          return;
        }
        findCatPage = true;
        catPage = 0;
        while(findCatPage){
          if(allCategories.hasOwnProperty(category+catPage)){
            let itemLength = allCategories[category+catPage].items.length;
            if(itemLength==9){
              allCategories[category+catPage].next_page_number = catPage+2;
              catPage++;
            }
            else{
              allCategories[category+catPage].items.push({title:post.title,slug:post.slug,image:post.image,date:post.date});
              findCatPage = false;
              categoryPagesCount[category] = catPage;
            }
          }
          else{
            allCategories[category+catPage] = {title:category,page_number:catPage+1,items:[{title:post.title,slug:post.slug,image:post.image,date:post.date}]};
            findCatPage = false;
            categoryPagesCount[category] = catPage;
          }
        }
      })
    });
    for (const [category, count] of Object.entries(categoryPagesCount)) {
      for(let i=0;i<=count;i++){
        allCategories[category+i].total_pages = count+1;
      }
    }
    allCategories = Object.values(allCategories);
    return allCategories;
}

const extractExcerpt = (content) => {

  /*Stripping tags*/
  if(content){
    content = content.replace(/(<([^>]+)>)/gi, "");
    content = content.replace(/^(.{300}[^ ]*).*/gis, "$1...");
    content = JSON.stringify(content);
  }
	return content;
}

module.exports = {
    getCacheOrFetch,
    getCacheAndFetchSingleItem,
    sortByDate,
    addCategoryData,
    extractExcerpt,
}