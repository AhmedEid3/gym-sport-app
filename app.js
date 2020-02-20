const sqlite3 = require("sqlite3").verbose();
const databasePath = './db/gym-app.db';
const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'pug');


const titleBase = ' | GYM App';
app.get('/', (req, res) => {
    res.render('home', {title: `Home Page ${titleBase}`})
});

app.get('/admin', (req, res) => {
    res.render('admin', {title: `admin Page ${titleBase}`});
});

app.post('/admin', (req, res) => {
    // open the database
    let db = openDatabase();

    // update database
    const sql = `UPDATE 
                    admin
                SET 
                    userName = '${req.body.userName}',
                    password = '${req.body.password}' 
                WHERE 
                    adminId = 1 AND
                    password = '${req.body.oldPassword}'` ;

    db.serialize(()=>{
        db.run(sql, function (err) {

            if (err) {
                console.error(err.message);
                return res.send('Faild!!');
            }
            res.send('succes');
        });

    });

    //close database
    closeDatabase(db);
});

app.get('/details-member', (req, res) => {
    res.render('details-member', {title: `details-member ${titleBase}`});
});

app.get('/edit-member', (req, res) => {
    res.render('edit-member', {title: `edit-member Page ${titleBase}`});
});

app.get('/history-member', (req, res) => {
    res.render('history-member', {title: `history-member Page ${titleBase}`});
});

app.get('/register-member', (req, res) => {
    res.render('register-member', {title: `register-member Page ${titleBase}`});
});
app.post('/register-member', (req, res) => {
    // open the database
    let db = openDatabase();
    let id = +req.body.clientId;
    // update database
    const sql = `
                INSERT INTO 
                    client(clientId, firstName, lastName, startMemberDate, endMemberDate)
                VALUES(${id},'${req.body.firstName}','${req.body.lastName}',
                        '${req.body.startMemberDate}','${req.body.endMemberDate}')
` ;

    db.serialize(()=>{
        db.run(sql, function (err) {
            console.log(req.body, typeof id, id);
            if (err) {
                console.error(err.message);
                return res.send('Faild!!');
            }
            res.send('register');
        });

    });

    //close database
    closeDatabase(db);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// open database
function openDatabase() {
    return new sqlite3.Database(
        databasePath,
        sqlite3.OPEN_READWRITE,
        err => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Connected to the chinook database.");
        }
    );
}

// close database
function closeDatabase(db) {
    db.close(err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Closed database connection.");
    });
}