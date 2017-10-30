var express = require('express');
var session = require('express-session');
var config = require('../etc/config.json');
var bodyParser = require ('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: '123qwe123e',
    resave: false,
    saveUninitialized: true,
    // store: new MySQLStore({
    //     host: config.db.host,
    //     port: config.db.port,
    //     user: config.db.user,
    //     password: config.db.password,
    //     database: config.db.database
    // })
}));
app.get('/auth/logout',(req,res)=>{
    delete req.session.displayName;
    res.redirect('/welcome');
});
app.get('/welcome',(req,res)=>{
    if(req.session.displayName){
        res.send(`
        <h2>Hello, ${req.session.displayName}</h2>
        <a href='/auth/logout'>Logout</a>
        `);
    }
    else{
        res.send(`
        <h2>Welcome</h2>
        <a href='/auth/login'>Login</a>
        `);
    }
    
});
app.get('/count',(req,res) =>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
      res.send('count : ' + req.session.count);
});
app.post('/auth/login',(req,res) =>{
    let user = {
        username: 'Dima',
        pass: '123',
        displayName: 'Boss'
    };
    let uname = req.body.username;
    let pwd = req.body.password;
  
    if(uname === user.username && pwd === user.pass){
        req.session.displayName = user.displayName;
        res.redirect('/welcome')
    } else {
        res.send('I do not know you. <a href="/auth/login">Login</a>');
    }

    
});
app.get('/auth/login',(req,res) =>{
    let output = `
        <h3>Sign in</h3>
        <form action='/auth/login' method='post'>
        <p>
            <input type='text' name='username' placeholder='username'>
        </p>
        <p>
            <input type='password' name='password' placeholder='password'>
        </p>
        <button type='submit'>Entry</button>
        </form>
    `;
    res.send(output);
});


const server = app.listen(config.serverPort,()=>{
    console.log(`Server is up and runnig ${config.serverPort}`);
});