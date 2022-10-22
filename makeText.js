/** Command-line tool to generate Markov text. */
const { MarkovMachine } = require("./markov");
const { readFile } = require("fs");

readFile("./eggs.txt", "utf8", (err, data) => {
  if (err) {
  } else {
    let markov = new MarkovMachine(data);
    console.log(markov.makeText(50));
  }
});
