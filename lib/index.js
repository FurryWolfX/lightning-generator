const mysql = require("mysql");
const ejs = require("ejs");

const config = {
  host     : '192.168.1.22',
  user     : 'root',
  password : 'junlian',
  database : 'test'
};

module.exports.getColumns = tableName => {
  return new Promise(resolve => {
    const connection = mysql.createConnection(config);
    connection.connect();
    connection.query(`SHOW FULL COLUMNS FROM ${tableName}`,  (error, results, fields) => {
      if (error) throw error;
      resolve(results);
    });
    connection.end();
  });
};

module.exports.renderFile = (filename, data) => {
  return new Promise(resolve => {
    ejs.renderFile(filename, data, {}, function(error, str){
      if (error) throw error;
      resolve(str);
    });
  });
};
