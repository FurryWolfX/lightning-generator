const path = require("path");
const fs = require("fs");
const prettier = require("prettier");
const lodash = require("lodash");
const makeDir = require("make-dir");

const { getColumns, renderFile, getTables, setConfig } = require("./db");

async function render(tableName) {
  console.log("process", tableName);
  const col = await getColumns(tableName);
  // service
  let str = await renderFile(path.resolve("template/service.template"), {
    col,
    table_name: tableName,
    tableName: lodash.camelCase(tableName),
    TableName: lodash.upperFirst(lodash.camelCase(tableName))
  });
  str = prettier.format(str, { parser: "typescript" });
  fs.writeFileSync(
    path.resolve(`generator/service/${lodash.camelCase(tableName)}.ts`),
    str,
    {
      encoding: "utf-8"
    }
  );
  // router
  str = await renderFile(path.resolve("template/router.template"), {
    col,
    table_name: tableName,
    tableName: lodash.camelCase(tableName),
    TableName: lodash.upperFirst(lodash.camelCase(tableName)),
    lodash
  });
  str = prettier.format(str, { parser: "typescript" });
  fs.writeFileSync(
    path.resolve(`generator/router/${lodash.camelCase(tableName)}.ts`),
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
  for (let i = 0; i < tables.length; i++) {
    const item = tables[i];
    try {
      await render(item["Tables_in_" + dbName]);
    } catch (err) {
      if (err) throw err;
    }
  }
}

module.exports = {
  render,
  renderAll
};
