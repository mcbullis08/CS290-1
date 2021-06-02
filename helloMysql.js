var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();

app.set('port', 3000);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

//Query string varibles
var showData = 'SELECT * FROM workout';
var insertData = "INSERT INTO workout (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)";
var deleteData = "DELETE FROM workout WHERE id=?";
var updateData = "UPDATE workout SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ";
var resetTable = "DROP TABLE IF EXISTS workout";
var makeTable = `CREATE TABLE workouts(
                 id INT PRIMARY KEY AUTO_INCREMENT,
                 name VARCHAR(255) NOT NULL,
                 reps INT,
                 weight INT,
                 date DATE,
                 lbs BOOLEAN);`;
// unit of 0 is lbs, unit of 1 is kgs

function getData() {
  mysql.pool.query( deleteData, [req.query.id], function(err, result) {
    if(err) {
      next(err);
      return;
    }
    res.json({ "rows" : rows });
  });
};

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query( showData, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

app.post('/',function(req,res,next){
  var context = {};
  var { name, reps, weight, date, lbs } = req.body
  mysql.pool.query( insertData, [name, reps, weight, date, lbs], function(err, result) {
    if(err) {
      next(err);
      return;
    }
    getData();
  });
});

app.delete('/',function(req,res,next){
  var context = {};
  mysql.pool.query( deleteData, [req.query.id], function(err, result) {
    if(err){
      next(err);
      return;
    }
    getData();
  });
});

app.put('/',function(req,res,next){
  var context = {};
  var { name, reps, weight, date, lbs } = req.body
  mysql.pool.query( updateData, [name, reps, weight, date, lbs], function(err, result) {
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query( resetTable, function(err){
    mysql.pool.query( makeTable, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
