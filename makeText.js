/** Command-line tool to generate Markov text. */
const { MarkovMachine } = require("./markov");
const axios = require("axios");
const { readFile } = require("fs");

function markovFromFile(path) {
  if (!path) {
    console.log("INVALID INPUT: Path to file is required.");
  } else {
    readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(`Error reading from file`, err.message);
      } else {
        let markov = new MarkovMachine(data);
        console.log(markov.makeText());
      }
    });
  }
}

async function markovFromURL(url) {
  if (!url) {
    console.log("INVALID INPUT: A valid url is required.");
  } else {
    try {
      let resp = await axios.get(url);
      let markov = new MarkovMachine(resp.data);
      console.log(markov.makeText());
    } catch (err) {
      console.log(`Error fetching ${url}:\n`, err.message);
    }
  }
}

if (process.argv[2] === "file") {
  markovFromFile(process.argv[3]);
} else if (process.argv[2] === "url") {
  markovFromURL(process.argv[3]);
} else {
  console.log(
    "INVALID ARGUMENT: Must specify whether the input is a file or URL."
  );
}
