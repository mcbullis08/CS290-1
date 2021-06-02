var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_bullisje',
  password        : '1057',
  database        : 'cs290_bullisje'
});

module.exports.pool = pool;
