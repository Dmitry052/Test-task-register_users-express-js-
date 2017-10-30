// Описание роутов
import express from 'express';
import * as db from './utils/DataBaseUtils.js';
//import bodyParser from 'body-parser';
import {serverPort} from '../etc/config.json';

// Подключаемся к базе
const _dbConnection = db.setUpConnection();
// Инициализация приложения
const app = express();
// инициализируем парсер
//app.use(bodyParser.json());

app.get('/',(req,res) =>{
    res.send('Success');
});

app.get('/test',(req,res) =>{
//    let sql = 'SELECT * FROM requests WHERE id=52';
//    let query = _dbConnection.query(sql, (err,result) => {
//         if(err) throw err;
//         console.log(result);
//    });
   res.send('Test');
});

// Слушаем порт
const server = app.listen(serverPort,()=>{
    console.log(`Server is up and runnig ${serverPort}`);
});