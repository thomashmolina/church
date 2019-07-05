var express = require('express');
var mysql = require('mysql')
var router = express.Router();
var app = express();

var maximum = "";
var program = {};


/* GET AND POST home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Home'});
});

router.post('/', function(req, res, next) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hercules96!',
    database: 'church_programs'
  });

  connection.connect();

  try {
    get_max(connection, function(result){
      var maximum = result[0].max;
      console.log(maximum);
      update_program(maximum, connection, function(r){
        program = r;
        console.log(program);
        res.send(program);
        connection.end();
      });
    });
  } catch(e){
    console.log(e);
  }

});


//GET  AND POST request handlers for fhe
router.get('/admin/fhe', function(req, res, next) {
  console.log(req.query.type);
  if(req.query.type != 'most_recent'){
    res.render('admin/fhe', {title: 'FHE'});
  }
  else {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Hercules96!',
      database: 'church_programs'
    });
    connection.connect();
    try {
      get_fhe_max(connection, function(result){
        var maximum = result[0].max;
        console.log(maximum);
          update_fhe(maximum, connection, function(data, err){
            if(err) throw err;
            console.log(data);
            res.send(data);
            connection.end();
          });
      });
    } catch(e){
      console.log(e);
    }

  }

});
router.post('/admin/fhe', function(req, res, next) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hercules96!',
    database: 'church_programs'
  });
  connection.connect();
  let data = req.body;
  console.log(data);
  let vals = [data['time'], data['place'], data['address'], data['description']];
  console.log(vals);
  var sql = "INSERT INTO fhe (time_inserted, time, place, address, description) ";
  sql += "VALUES (now(), ?, ?, ?, ?);";
  sql = mysql.format(sql, vals);
  try{
    var response = connection.query(sql, function(err){
      if(err) throw err;
      res.sendStatus(200);
    });
  } catch(e) {
    console.log(e);
  }

  connection.end();
});
/// END FHE GET AND POST



//GET AND POST FOR SPOTLIGHT
router.get('/admin/spotlight', function(req, res, next) {
  console.log(req.query.what);
  if(req.query.what != 'spotlights'){
    res.render('admin/spotlight', {title: 'Spotlight'});
  }
  else {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Hercules96!',
      database: 'church_programs'
    });
    connection.connect();
    try {
      get_spotlight_max(connection, function(result){
        var maximum = result[0].max;
        console.log(maximum);
          update_spotlight(maximum, connection, function(data, err){
            if(err) throw err;
            console.log(data);
            res.send(data);
            connection.end();
          });
      });
    } catch(e){
      console.log(e);
    }

  }

});

router.post('/admin/spotlight', function(req, res, next) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hercules96!',
    database: 'church_programs'
  });
  connection.connect();
  let data = req.body;
  console.log(data);
  let names = data['names[]'];
  let instas = data['insta[]'];
  console.log(names);
  console.log(instas);
  if(!Array.isArray(names)){
    names = [names];
  }
  if(!Array.isArray(instas)){
    instas = [instas];
  }
  console.log(names);
  console.log(instas);
  var sql = "INSERT INTO spotlights (name, insta, date) ";
  sql += "VALUES (";
  for(let i = 0; i < names.length; i++){
    let name = names[i];
    let insta = instas[i];
    sql += "\"" + name + "\", ";
    sql += "\"" +insta + "\", now())"
    if(i < names.length-1){
      sql += ",(";
    }
  }
  sql += ";";
  console.log(sql);

  try{
    var response = connection.query(sql, function(err){
      if(err) throw err;
      res.sendStatus(200);
    });
  } catch(e) {
    console.log(e);
  }
  connection.end();
});
//END GET AND POST FOR SPOTLIGHT


//GET page for contact
router.get('/admin/contact', function(req, res, next) {
  console.log(req.query.type);
  if(req.query.type != 'most_recent'){
    res.render('admin/contact', {title: 'Contact'});
  }
  else {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Hercules96!',
      database: 'church_programs'
    });
    connection.connect();
    try {
      get_contact_max(connection, function(result){
        var maximum = result[0].max;
        console.log(maximum);
          update_contact(maximum, connection, function(data, err){
            if(err) throw err;
            console.log(data);
            res.send(data);
            connection.end();
          });
      });
    } catch(e){
      console.log(e);
    }

  }

});

/* GET spotlight page */
router.get('/spotlight', function(req, res, next) {
  res.render('spotlight', {title: 'Spotlight'});
});

/* GET fhe page */
router.get('/fhe', function(req, res, next) {
  res.render('fhe', {title: 'FHE'});
});

/* GET contact page */
router.get('/contact', function(req, res, next) {
  res.render('contact', {title: 'Contact'});
});

/* GET admin page */
router.get('/admin', function(req, res, next) {
  res.render('admin', {title: 'Admin'});
});

/* Handlers for admin page */
router.post('/admin', function(req, res){

  var obj = {};
  var parameters = ['#presiding','#announcer','#chorister','#pianist','#conducting','#benediction','#intermediate-hymn','#sacrament-hymn','#opening-hymn','#closing-hymn','#invocation','#speaker'];


  if(req.body['type'] == 'add'){
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Hercules96!',
      database: 'church_programs'
    });
      connection.connect();

      var sql = "INSERT INTO programs (time, presiding, announcer, chorister, pianist, conducting , benediction, intermediate_hymn, sacrament_hymn, opening_hymn, closing_hymn, invocation, speakers)";
      sql += " VALUES (now(), ";

      for(let i = 0; i < parameters.length; i++){
        value = req.body[parameters[i]];
        isEmpty(value) ? value = "By invitation" : value = value;
        console.log(req.body[parameters[i]], " => ", value);
        if(i < parameters.length-1){
          sql += "\'"+value + "\', ";
        }
        else {
          sql += "\'" + value + "\'";
        }
      }
      sql +=  ");";
      console.log(sql);
      try{
        var response = connection.query(sql, function(err){
          if(err) throw err;
        });
      } catch(e) {
        console.log(e);
      }

      res.sendStatus(200);
      connection.end();
  }
  else if(req.body['type'] == 'get') {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Hercules96!',
      database: 'church_programs'
    });

    connection.connect();

    try {
      get_max(connection, function(result){
        maximum = result[0].max;
        console.log(maximum);
        get_program(maximum, connection, function(r){
          program = r;
          console.log(program);
          res.send(program);
          connection.end();
        });
      });
    } catch(e){
      console.log(e);
    }

  }
  else{
    console.log('\n\n\nerrror\n\n\n');
  }
});

function get_max(connection, callback){
  var sql = 'SELECT MAX(id) as max from programs;';
  connection.query(sql, function(error, result, fields){
    if(error) throw error;
    return callback(JSON.parse(JSON.stringify(result)));
  });
}
function get_fhe_max(connection, callback){
  var sql = 'SELECT MAX(id) as max from fhe;';
  connection.query(sql, function(error, result, fields){
    if(error) throw error;
    return callback(JSON.parse(JSON.stringify(result)));
  });
}
function get_spotlight_max(connection, callback){
  var sql = 'SELECT MAX(id) as max from spotlights;';
  connection.query(sql, function(error, result, fields){
    if(error) throw error;
    return callback(JSON.parse(JSON.stringify(result)));
  });
}
function get_program(maximum, connection, callback){
  sql = "SELECT presiding, announcer, chorister, pianist, conducting FROM programs WHERE id = " + maximum + ";";
  connection.query(sql, function(error, result, fields){
    if(error) throw error;
    return callback(JSON.parse(JSON.stringify(result)));
  });
}

function update_program(max, connection, callback){
  sql = "SELECT presiding, announcer, chorister, pianist, conducting, benediction, invocation, intermediate_hymn, sacrament_hymn, opening_hymn, closing_hymn, speakers FROM programs WHERE id = " + max + ";";
  connection.query(sql, function(error, result, fields){
    if(error) throw error;
    return callback(JSON.parse(JSON.stringify(result)));
  });
}
function update_fhe(max, connection, callback) {
  var sql = "SELECT time, place, address, description FROM fhe WHERE id = ?;";
  sql = mysql.format(sql, max);
  connection.query(sql, function(err, result, fields){
    if(err) throw err;
    console.log(result);
    return callback(JSON.parse(JSON.stringify(result))[0]);
  });
}
function update_spotlight(max, connection, callback) {
  var sql = "SELECT name, insta FROM spotlights WHERE id = ?;";
  sql = mysql.format(sql, max);
  connection.query(sql, function(err, result, fields){
    if(err) throw err;
    console.log(result);
    return callback(JSON.parse(JSON.stringify(result))[0]);
  });
}

function isEmpty(str){
  b = true;
  if(str == ""){
    return b;
  }
  else {
    for(var i = 0; i < str.length; i++){
      if(str[i] != " "){
        b = false;
      }
    }
  }
  return b;
}

function setMax(v){
  obj['max'] = v;
}

function setProg(v){
  prog = v;
  console.log(prog);
}

module.exports = router;
