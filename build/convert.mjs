
import imagemin from 'imagemin';
import webp from 'imagemin-webp';
import dircompare from 'dir-compare'
const { Options, compare } = dircompare
import path from 'path'

const options = {
    compareSize: false,                    // compare only name by disabling size and content criteria
    compareContent: false,
    compareNameHandler: customNameCompare, // new name comparator used to ignore extensions
    ignoreExtension: true,                 // supported by the custom name compare below
};

function customNameCompare(name1, name2, options) {
    if (options.ignoreCase) {
        name1 = name1.toLowerCase()
        name2 = name2.toLowerCase()
    }
    if (options.ignoreExtension) {
        name1 = path.basename(name1, path.extname(name1))
        name2 = path.basename(name2, path.extname(name2))
    }
    return ((name1 === name2) ? 0 : ((name1 > name2) ? 1 : -1))
}

const path1 = 'src/assets/images/build';
const path2 = 'src/assets/images/';

async function compareFolders(){ 
  const res = await compare(path1, path2, options)
  if (!res.diffSet) {
      return
  }
  return res.diffSet
  .filter((n)=>{return n.state})
  .map((n)=>{return n.path2+n.name2})
}

const produceWebP = async () => {
  let images = await compareFolders();
  console.log(images);
  await imagemin(images, {
    destination: path1,
    plugins: [
      webp({
        quality: 85
      })
    ]
  })
  console.log('JPGs and JPEGs processed')
}
produceWebP()