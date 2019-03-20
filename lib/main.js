const path = require("path");
const fs = require("fs");
const prettier = require("prettier");
const lodash = require("lodash");
const makeDir = require("make-dir");
const async = require("async");

const { getColumns, renderFile, getTables, setConfig } = require("./db");

async function render(tableName) {
  console.log("process", tableName);
  const col = await getColumns(tableName);
  // service
  let str = await renderFile(path.resolve("template/service.template"), {
    col,
    table_name: tableName,
    tableName: lodash.camelCase(tableName)
  });
  str = prettier.format(str, { parser: "babel" });

  fs.writeFileSync(
    path.resolve(`generator/service/${lodash.camelCase(tableName)}.js`),
    str,
    {
      encoding: "utf-8"
    }
  );
  // router
  str = await renderFile(path.resolve("template/router.template"), {
    col,
    tableName: lodash.camelCase(tableName),
    table_name: tableName,
    lodash
  });
  str = prettier.format(str, { parser: "babel" });
  fs.writeFileSync(
    path.resolve(`generator/router/${lodash.camelCase(tableName)}.js`),
    str,
    {
      encoding: "utf-8"
    }
  );
  // yml
  str = await renderFile(path.resolve("template/yml.template"), {
    col,
    tableName: lodash.camelCase(tableName),
    table_name: tableName,
    lodash
  });
  fs.writeFileSync(
    path.resolve(`generator/yaml/${lodash.camelCase(tableName)}.yml`),
    str,
    {
      encoding: "utf-8"
    }
  );
}

async function renderAll(config) {
  setConfig(config);
  const dbName = config.database;
  await makeDir("generator/service");
  await makeDir("generator/router");
  await makeDir("generator/yaml");
  const tables = await getTables(dbName);
  async.mapLimit(
    tables,
    1,
    async item => {
      return await render(item["Tables_in_" + dbName]);
    },
    (err, results) => {
      if (err) throw err;
    }
  );
}

module.exports = {
  render,
  renderAll
};
