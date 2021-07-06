const zipFolder = require('zip-folder');
const packageJSON = require('./package.json')
const version = packageJSON.version

zipFolder('./extension-build', `./focused-browsing-${version}.zip`, function(err) {
    if(err){
        console.log('error in zipping extenion', err)
    }else{
        console.log('We have zipped our extension')
    }
});
