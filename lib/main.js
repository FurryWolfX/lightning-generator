const path = require("path");
const fs = require("fs");
const prettier = require("prettier");
const lodash = require("lodash");
const makeDir = require("make-dir");

const { getColumns, renderFile, getTables, setConfig } = require("./db");

async function render(tableName, group) {
  console.log("process", tableName);
  const col = group[tableName];
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
  const group = lodash.groupBy(tables, "TableName");
  const tableNameList = Object.keys(group);
  for (let i = 0; i < tableNameList.length; i++) {
    await render(tableNameList[i], group);
  }
  process.exit(0);
}

module.exports = {
  renderAll
};
