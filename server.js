(
    function()
    {
        "use strict";

        var express = require('express');

        var app = express();
        var bodyParser = require("body-parser");

        app.disable('view cache');
        app.set('json spaces', 4);
        app.use(bodyParser.urlencoded(
        {
            extended: true
        }));
        app.use(bodyParser.json());

        var http = require('http');
        var url = require('url');
        var path = require('path');
        var fs = require('fs');
        var R = require('ramda');

        http.createServer(app).listen(process.env.PORT || 8084);

        // config

        // var imagesFolder = "/Users/peterorum/Dropbox/Photos/B&W";
        var imagesFolder = "/Volumes/Users/Peter/Pictures/Photos/2015";

        var sendFile = function(res, filename)
        {
            var folder;

            if (/(png|jpg)$/.test(filename))
            {
                folder = imagesFolder;
            }
            else
            {
                folder = process.cwd();
            }

            var filepath = path.join(folder, decodeURI(filename));

            res.sendFile(filepath, function(err)
            {
                if (err)
                {
                    console.log(err);
                    res.status(err.status).end();
                }
                else
                {
                    // console.log('Sent:', filename);
                }
            });
        };

        // files
        app.get(/\.(js|css|png|jpg|html)$/, function(req, res)
        {
            var uri = url.parse(req.url, true, false);

            sendFile(res, uri.pathname);
        });

        // home page
        app.get('/', function(req, res)
        {
            sendFile(res, '/views/index.html');
        });

        // get images from local file system
        app.get('/getimages', function(req, res)
        {
            console.log('getimages');

            var files = fs.readdirSync(imagesFolder);

            files = R.filter(function(f)
            {
                return /(png|jpg)$/.test(f);
            }, files);

            var images = R.map(function(f)
            {
                return {
                    name: f,
                    date: fs.statSync(path.join(imagesFolder, f)).mtime
                };
            }, files);

            images = R.sortBy(function(f)
            {
                return f.date;
            }, images);

            images.reverse();

            console.log(images);

            res.json(
            {
                images: images
            });
        });
    }()
);
