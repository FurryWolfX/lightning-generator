const path = require("path");
const fs = require("fs");
const prettier = require("prettier");
const { getColumns, renderFile } = require("../lib");

async function render(tableName) {
  const col = await getColumns(tableName);
  const str = await renderFile(path.resolve("template/service.ejs"), {
    col,
    tableName
  });
  const fStr = prettier.format(str, { parser: "babel" });
  fs.writeFileSync(path.resolve(`generator/service/${tableName}.js`), fStr,{ encoding: "utf-8" });
}

render("user");
