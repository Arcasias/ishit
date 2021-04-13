const path = require("path");
const fs = require("fs");

let [INPUT_FILE, OUTPUT_FILE, KEYS] = process.argv.slice(2);
if (!INPUT_FILE) {
  INPUT_FILE = path.join(path.dirname(process.argv[1]), "package.json");
}
if (!OUTPUT_FILE) {
  OUTPUT_FILE = INPUT_FILE;
}
KEYS = KEYS?.split(",") || [];

const package = require(INPUT_FILE);

const data = {};
for (const key of KEYS) {
  if (key in package) {
    data[key] = package[key];
  }
}
const json = JSON.stringify(data, null, 2);

fs.writeFile(OUTPUT_FILE, json, () => {
  console.log("Package exported", KEYS.length, "keys");
});
