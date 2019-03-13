const mysql = require("mysql");
const ejs = require("ejs");

let config = {
  host: "192.168.1.22",
  user: "root",
  password: "junlian",
  database: "user"
};

module.exports.setConfig = cfg => {
  config = cfg;
};

module.exports.getColumns = tableName => {
  return new Promise(resolve => {
    const connection = mysql.createConnection(config);
    connection.connect();
    connection.query(
      `SHOW FULL COLUMNS FROM ${tableName}`,
      (error, results, fields) => {
        if (error) throw error;
        resolve(results);
      }
    );
    connection.end();
  });
};

module.exports.getTables = dbName => {
  return new Promise(resolve => {
    const connection = mysql.createConnection(config);
    connection.connect();
    connection.query(`show tables from ${dbName}`, (error, results, fields) => {
      if (error) throw error;
      resolve(results);
    });
    connection.end();
  });
};

module.exports.renderFile = (filename, data) => {
  return new Promise(resolve => {
    ejs.renderFile(filename, data, {}, function(error, str) {
      if (error) throw error;
      resolve(str);
    });
  });
};
