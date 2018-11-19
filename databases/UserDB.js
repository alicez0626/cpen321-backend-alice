var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'userdb',
  //multipleStatements: true,
  port: 3306
});

db.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to UserDB...');
});

function query(req){
  return new Promise ( (resolve, reject) => {
    db.query(req, (err, result) => {
      if (err){
        reject(err);
      }
      resolve(result);
    })
  });
}

function end(){
  db.end();
}


module.exports = {
  query,
  end
}
