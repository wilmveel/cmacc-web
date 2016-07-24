var fs = require("fs");
var url = require("fs");
var request = require("request");

var imp = {

    readFile : function(file, callback){

        if(window.document){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    callback(null, xhttp.responseText)
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }

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