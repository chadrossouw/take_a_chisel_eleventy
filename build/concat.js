'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');

const args = process.argv;
let src = args[2];
const dest = args[3];
if(!src  || !dest){
    return console.log('You need to supply a src path (can use glob patterns) and dest path argument')
}
src=src.replace(/\\/g,"/");
console.log(src);
var concatenatedJson =[];

glob(src,(err,matches)=>{
    if(err){
        return console.log(err);
    }
    else if(matches && matches.length>0){
        matches.forEach(match=>concatJson(match));
        saveFile(dest, JSON.stringify(concatenatedJson, null, 2))
    }
    else{
        return console.log('No matches');
    }
})


/**
 * Obtain the contents of the source .json file.
 * @param {String} filepath - The filepath to the source json file.
 * @returns {String} The json content.
 */
function readJsonFile(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf8' });
}

/**
 * Create a new json/object using filename as key for files content.
 * @param {String} filepath - The filepath to the source json file.
 */
function concatJson(filePath) {
  const json = readJsonFile(filePath);
  concatenatedJson.push(JSON.parse(json));
}

/**
 * Save the resultant concatenated json file.
 * @param {String} filepath - The filepath to save the resultant json file.
 * @param {String} content - The json content to save to file.
 */
function saveFile(filePath, content) {
  fs.writeFile(filePath, content, function(err) {
    if (err) {
      return console.log(err);
    }
      console.log(' Successfully created: ' + dest);
  });
}




//  saveFile(destPath, JSON.stringify(concatenatedJson, null, 2));
