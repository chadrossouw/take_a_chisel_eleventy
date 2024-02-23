const fs = require('fs');

const webTmpPath = "../web_tmp";
const webPath = "../web";
const tmpPath = "../tmp";

const renameWebtoTmp = async () => {
    const webToTmp = await rename(webPath,tmpPath);
    console.log(webToTmp);
    const webTmpToWeb = await rename(webTmpPath,webPath);
    console.log(webTmpToWeb);
    const tmpToWebTmp = await rename(tmpPath,webTmpPath);
    console.log(tmpToWebTmp);
}

const rename = async (currPath, newPath) => {
    try{
        await fs.promises.rename(currPath, newPath);
        return `${currPath} renamed to ${newPath} successfully`;
    }
    catch(err){
        return err;
    }
}

renameWebtoTmp();