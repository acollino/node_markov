/** Command-line tool to generate Markov text. */
const { MarkovMachine } = require("./markov");
const axios = require("axios");
const { readFileSync } = require("fs");

function markovFromFile(path) {
  if (!path) {
    return "INVALID INPUT: Path to file is required.";
  } else {
    try {
      let data = readFileSync(path, "utf8");
      let markov = new MarkovMachine(data);
      return markov.makeText();
    } catch (err) {
      return `Error reading from ${path}\n${err.message}`;
    }
  }
}

async function markovFromURL(url) {
  if (!url) {
    return "INVALID INPUT: A url is required.";
  } else {
    try {
      let resp = await axios.get(url);
      let markov = new MarkovMachine(resp.data);
      return markov.makeText();
    } catch (err) {
      return `Error requesting from ${url}\n${err.message}`;
    }
  }
}
if (require.main === module) {
  if (process.argv[2] === "file") {
    console.log(markovFromFile(process.argv[3]));
  } else if (process.argv[2] === "url") {
    markovFromURL(process.argv[3]).then((text) => console.log(text));
  } else {
    console.log(
      "INVALID ARGUMENT: Must specify whether the input is a file or URL."
    );
  }
}

module.exports = { markovFromFile, markovFromURL };
