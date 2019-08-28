const mssql = require("mssql");
const ejs = require("ejs");
const _ = require("lodash");

const config = {
  user: "sa",
  password: "",
  server: "", // You can use 'localhost\\instance' to connect to named instance
  database: "",
  port: null
};

const sql = `
SELECT
A.name AS TableName,
B.name AS Field,
C.value AS Comment,
D.data_type as Type
FROM sys.tables A
INNER JOIN sys.columns B ON B.object_id = A.object_id
INNER JOIN INFORMATION_SCHEMA.COLUMNS D ON B.name = D.column_name
LEFT JOIN sys.extended_properties C ON C.major_id = B.object_id AND C.minor_id = B.column_id
`;

let pool;

module.exports.setConfig = cfg => {
  config.user = cfg.user;
  config.password = cfg.password;
  config.server = cfg.server;
  config.database = cfg.database;
  config.port = cfg.port;
  pool = mssql.connect(config);
};

module.exports.getColumns = async tableName => {
  const list = _.filter();
};

module.exports.getTables = async dbName => {
  const _pool = await pool;
  let result = await _pool.request().query(sql);
  return result.recordset;
};

module.exports.renderFile = async (filename, data) => {
  await module.exports.getTables();

  return new Promise(resolve => {
    ejs.renderFile(filename, data, {}, function(error, str) {
      if (error) throw error;
      resolve(str);
    });
  });
};
