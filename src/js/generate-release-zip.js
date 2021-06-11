var zipFolder = require('zip-folder');

zipFolder('../../extension-build', '../extension-build-release', function(err) {
    if(err){
        console.log('error in zipping extenion', err)
    }else{
        console.log('We have zipped our extension')
    }
});
