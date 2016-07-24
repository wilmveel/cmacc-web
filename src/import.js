var fs = require("fs");
var request = require("request");

var imp = {

    readFile : function(file, callback){

        if(/^http\:\/\//.test(file)){
            request(file, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(null, body)
                }
            })
            return;
        }

        fs.readFile(file, 'utf8', callback);

    }

};

module.exports = imp;