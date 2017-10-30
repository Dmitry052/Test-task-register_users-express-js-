var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
var config = require('../etc/config.json');
var bodyParser = require('body-parser');


var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var app = express();
var sqlConnetction = mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'sdfksfksdfksdhfkn23k4n23j4kn32jnke',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
    })
}));

app.get('/welcome', (req, res) => {
    console.log("welcome :" + req.session.displayname);
    if (req.session.displayname) {
        res.send(`
        <h2>Hello, ${req.session.displayname}</h2>
        <a href='/auth/logout'>Logout</a>
        `);
    }
    else {
        res.send(`
        <h2>Welcome</h2>
        <a href='/auth/login'>Login</a><br>
        <a href='/auth/register'>Register</a>
        `);
    }

});

app.post('/auth/login', (req, res) => {
    console.log(req.body);
    var uname = req.body.username;
    var pwd = req.body.password;

    var query = 'SELECT * FROM users WHERE authid = ?';
    sqlConnetction.query(query, ['local:' + uname], function (err, result) {
        var user = result[0];
        if (!user) {
            return res.send('No user. <a href="/auth/login">Login</a>');
        } else {
            return hasher({ password: pwd, salt: user.salt }, function (err, password, salt, hash) {
                console.log(req.session.displayname);
                if (hash === user.password) {
                    req.session.displayname = user.displayname;
                    console.log(req.session.displayname);
                    req.session.save(function () {

                        var query = 'SELECT service_type FROM users INNER JOIN company using(id) WHERE authid = ?';
                        sqlConnetction.query(query,['local:' + uname] , function (err, result) {
                            console.log(result);
                            alert();
                        });

                        res.redirect('/welcome');
                    });
                } else {
                    res.send('I do not know you. <a href="/auth/login">Login</a>');
                }
            });

        }
    });
});

app.get('/auth/login', (req, res) => {
    var output = `
        <h3>Sign in</h3>
        <form action='/auth/login' method='post'>
        <p>
            <input type='text' name='username' value='' placeholder='username'>
        </p>
        <p>
            <input type='text' name='password' value='' placeholder='password'>
        </p>
        <button type='submit'>Entry</button>
        </form>
    `;
    res.send(output);
});

app.post('/auth/register', (req, res) => {
    hasher({ password: req.body.password },
        function (err, password, salt, hash) {
            var user = {
                authid: 'local:' + req.body.username,
                username: req.body.username,
                password: hash,
                salt: salt,
                displayname: req.body.displayname,
                company_id: req.body.service_type
            };

            var sql = 'INSERT INTO users SET ?';
            sqlConnetction.query(sql, user, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500);
                }
                else {
                    req.session.displayname = user.displayname;
                    req.session.save(function () {
                        res.redirect('/welcome');
                    });
                }
            });
        });
});

app.get('/auth/register', (req, res) => {
    var register = `
    <h3>Register</h3>
    <form action='/auth/register' method='post'>
    <p>
        <input type='text' name='username' value='' placeholder='Username'>
    </p>
    <p>
        <input type='password' name='password' value='' placeholder='Password'>
    </p>
    <p>
        <input type='text' name='displayname' value='' placeholder='Display name'>
    </p>
    <p>
        <input type='' name='service_type' value='' placeholder='service type'>
    </p>
    <button type='submit'>Entry</button>
    </form>
    `;
    res.send(register);
});

app.get('/auth/logout', (req, res) => {
    delete req.session.displayname;
    req.session.save(function () {
        res.redirect('/welcome');
    });
});

const server = app.listen(config.serverPort, () => {
    console.log(`Server is up and runnig ${config.serverPort}`);
});