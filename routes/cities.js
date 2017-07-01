var express = require("express");
var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({extended:false});
var router = express.Router();

var redis = require("redis");
client = redis.createClient();
client.select((process.env.NODE_ENV||'development').length);
//client.hset("cities","Lotopia","Description");
//client.hset("cities","Caspiana","Some Description");
//client.hset("cities","Indigo","Description");


router.route('/')
    .get(function(request,response){
        client.hkeys("cities", function(error,names){
            if(error) throw error;
            response.json(names);
        });
    })

    .post( urlencode, function(request,response){
        var newCity = request.body;
        if(!newCity.name || !newCity.description){
            response.sendStatus(400);
            return false;
        }
        client.hset('cities',newCity.name,newCity.description,function(error){
            if(error) throw error;
            response.status(201).json(newCity.name);
        });
        
    });




router.route('/:name')
    .get(function(request,response){
        client.hget('cities', request.params.name, function(error, description) {
        response.render('show.ejs',
                        { city:
                            { name: request.params.name, description: description }
                        });
        });
    })
    .delete(function(request,response){
        client.hdel('cities',request.params.name, function(error){
            if(error) throw error;
            response.sendStatus(204);
        });
        
    });
module.exports = router;