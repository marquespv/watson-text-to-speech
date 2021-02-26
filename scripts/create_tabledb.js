var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "last_challenge2"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE mensagens (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, mensagem TEXT)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    con.end((err) => {
    if(err) {
        console.log('Erro to finish connection...', err)
        return 
    }
    console.log('The connection was finish...')
})
});  
