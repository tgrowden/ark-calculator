/*
 * Create an empty folder with this file as app.js. Then in a terminal:
 *
 * sudo npm install -g pm2
 * sudo rm -rf ~/.npm
 * npm init
 * npm install --save async lodash express pg knex body-parser fs
 * 
 * Then to run the app:
 *
 * pm2 start app.js
 *
 * To check on the app:
 *
 * pm2 show app
 *
 * To stop the app:
 * 
 * pm2 stop app
 *
 * Create a 'public' folder with sub-directories 'css', 'js', and 'img'.
 * Put any HTML, CSS, JS, or image files in those folders. 
 * Name the top level HTML file index.html and put it in the `public` 
folder.
 */


var async = require("async"),
  _ = require("lodash"),
  path = require("path"),
  express = require("express"),
  bodyParser = require("body-parser"),
  request = require("request");
  
var app = express();

// set up SQL builder
// TODO fill these in
var knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "ark",
    password: '...',
    database: "ark",
    ssl: false
  }
});

// TODO fill these in with the correct table name in the DB
var tables = {
  stats: "multipliers"
};

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// any requests to '/index.html' will return public/index.html, but any
// requests to the main page '/' should also show that file.
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// set up a route to read all stats from the database
// check out JavaScript Promises for more info on this pattern
app.get("/stats", function(req, res){
  knex(tables.stats).select().then(function(rows){
    res.json(rows);
  }, function(error){
    res.status(500).json({ error: error.message || error });
  });
});

var port = 8000;
app.listen(port, function(){
  console.log("Express server listening on port " + port);
});
