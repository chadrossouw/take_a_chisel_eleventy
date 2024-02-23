const fs = require('fs');
var glob = require( 'glob' );  
const path = require('path');

const assetsBuildPath = "../build/src/assets/images/";
const assetsPath = "../cms/wp-content/uploads/";

glob( `${assetsPath}**/*`, function( err, matches ) {
  if(err){
    return console.log(err);
  }
  else if(matches && matches.length>0){
    matches.forEach(match=>{
      //copyFile(match,assetsBuildPath)
      if(path.extname(match)){
        let basename = path.basename(match)
        copyFile(match,`${assetsBuildPath}${basename}`);
      }
    });
  }
  else{
      return console.log('No matches');
  }
});

const copyFile = async (src, dest) => {
  await fs.promises.copyFile(
    src, 
    dest, 
    fs.constants.COPYFILE_FICLONE
    );
}
