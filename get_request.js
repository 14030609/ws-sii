var request = require('request');
var headerOption = {
    "url": "http://localhost:3030/auth/",
    "headers": {
      "Authorization" : "Basic " + new Buffer("sii:1234").toString("base64")
    }
};

request(headerOption, function (error, response, body) {
        //console.log("Error: ", error);
      //console.log("Response:", response);
      console.log("Body:", body);
    }
);
