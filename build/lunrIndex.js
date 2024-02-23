const fs = require('fs');
const lunr = require('lunr');
const createIndex = () => {
    fs.access('../web_tmp/lunr.json', fs.constants.F_OK, (err) => {
        if (!err) {
            const index = fs.readFileSync('../web_tmp/lunr.json', { encoding: 'utf8' });
            const documents = JSON.parse(index);
            const idx = lunr(function () {
                this.ref('index')
                this.field('title')
                this.field('content')
                documents.forEach(function (doc) {
                    this.add(doc)
                }, this)
            })
            const file = JSON.stringify(idx);
            fs.writeFile('../web_tmp/lunrIndex.json', file, function(err) {
                if (err) {
                return console.log(err);
                }
                console.log(' Successfully created index');
            });
        }
    });
}
module.exports = createIndex;