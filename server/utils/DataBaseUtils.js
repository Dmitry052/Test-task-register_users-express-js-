import mysql from 'mysql';
import config from '../../etc/config.json';

// Create connect
export function setUpConnection(){
    const db = mysql.createConnection({
        host     : config.db.host,
        user     : config.db.user,
        password : config.db.password,
        database : config.db.database
    });

    db.connect((err) =>{
        if(err){
            throw err;
        }
        console.log('MySql Connected...');
    });
    return db;
}
