var express = require("express");
var app = express();
app.get('/',function(request,response){
    response.send('Hi Teja!');
});

app.listen(3000);