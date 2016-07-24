var fs = require("fs");
var url = require("url");
var request = require("request");

var imp = {


    readFile : function(file, callback){

        var parse = url.parse(file);

        if(typeof window != 'undefined' && window.document){

            var call = '';
            if(parse.protocol === "ipfs:")
                call += '/ipfs/' + file.replace('ipfs://', '')

            call += parse.path || '/'

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    callback(null, xhttp.responseText)
                }
            };
            xhttp.open("GET", call, true);
            xhttp.send();
            return;
        }

        if(parse.protocol === "http:"){
            request(file, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(null, body)
                }
            });
            return;
        }

        if(parse.protocol === "ipfs:"){

        }

        fs.readFile(file, 'utf8', callback);

    }

};

module.exports = imp;