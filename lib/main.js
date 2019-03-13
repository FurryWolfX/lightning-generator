const path = require("path");
const fs = require("fs");
const prettier = require("prettier");
const lodash = require("lodash");
const makeDir = require("make-dir");

const { getColumns, renderFile, getTables, setConfig } = require("./db");

async function render(tableName) {
  const col = await getColumns(tableName);
  // service
  let str = await renderFile(path.resolve("template/service.ejs"), {
    col,
    tableName
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
  str = await renderFile(path.resolve("template/router.ejs"), {
    col,
    tableName: lodash.camelCase(tableName),
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
}

async function renderAll(config) {
  setConfig(config);
  const dbName = config.database;
  await makeDir("generator/service");
  await makeDir("generator/router");
  const tables = await getTables(dbName);
  tables.forEach(item => render(item["Tables_in_" + dbName]));
}

module.exports = {
  render,
  renderAll
};
