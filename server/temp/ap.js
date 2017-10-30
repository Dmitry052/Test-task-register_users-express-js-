var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require ('body-parser');
var config = require('../etc/config.json');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: '123qwe123e',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    })
}));

const server = app.listen(config.serverPort,()=>{
    console.log(`Server is up and runnig ${config.serverPort}`);
});