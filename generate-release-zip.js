var zipFolder = require('zip-folder');
const version = "v0.91"

zipFolder('./extension-build', `./focused-browsing-${version}.zip`, function(err) {
    if(err){
        console.log('error in zipping extenion', err)
    }else{
        console.log('We have zipped our extension')
    }
});
