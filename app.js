const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mysql = require('mysql');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
app.use(express.static('public'));

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'hms'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql connected...');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/webpage.html');
});

io.on('connection', (socket) => {
    console.log("User Connected...");


    socket.on('display',(userID) => {
        let SQL = 'SELECT * FROM entries INNER JOIN patients WHERE entries.ID = '+ userID;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
        });
        socket.emit('entries',result);
    });

    socket.on('save',(uID,details) => {
        
        let SQL = 'UPDATE entries SET EntryDate = '+details[0].value+', EntryTime = '+details[1].value+', ExitDate = '+details[2].value+', ExitTime = '+details[3].value+' WHERE entries.ID = '+ uID;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
        });
    });
    socket.on('delete',(uID,details) => {
        
            let SQL = 'DELETE FROM entries WHERE EntryDate = '+details[0].value+' AND EntryTime = '+details[1].value+' AND ExitDate = '+details[2].value+' AND ExitTime = '+details[3].value+' AND entries.ID = '+ uID;
            let query = db.query(sql, (err, result) => {
                if(err) throw err;
                console.log(result);
            });
    });

});
app.listen(3001, () => {
    console.log('listening on *:3001');
});