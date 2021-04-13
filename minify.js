const querystring = require("querystring");
const https = require("https");
const fs = require("fs");

let [INPUT_FILE, OUTPUT_FILE] = process.argv.slice(2);

if (!OUTPUT_FILE) {
  OUTPUT_FILE = INPUT_FILE;
}

const bundle = fs.readFileSync(INPUT_FILE, "utf8");
const query = querystring.stringify({ input: bundle });

const req = https.request(
  {
    method: "POST",
    hostname: "javascript-minifier.com",
    path: "/raw",
  },
  function (res) {
    if (res.statusCode !== 200) {
      console.error("StatusCode=" + res.statusCode);
      return;
    }
    const minifiedList = [];
    let chunks = 0;
    res.on("data", (d) => {
      minifiedList.push(d);
      chunks++;
    });
    res.on("end", () => {
      const minified = minifiedList.join("");
      fs.writeFile(OUTPUT_FILE, minified, () => {
        console.log("Minified", bundle.length, "characters into", minified.length, "in", chunks, "chunks");
      });
    });
  }
);
req.setHeader("Content-Type", "application/x-www-form-urlencoded");
req.setHeader("Content-Length", query.length);
req.end(query, "utf8");
