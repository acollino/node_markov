const { markovFromFile, markovFromURL } = require("../makeText.js");

describe("Testing text generation sources", () => {
  test("Text output with expected filepath", () => {
    let text = markovFromFile("./eggs.txt");
    // the eggs file has 1-word sentences, so the machine should always
    // be able to produce exactly 100-word outputs.
    expect(text.split(" ").length).toEqual(100);
    expect(text).not.toEqual("INVALID INPUT: Path to file is required.");
    expect(text).not.toMatch("Error reading from ./eggs.txt");
  });

  test("Text output with expected url", () => {
    try {
      markovFromURL("https://www.gutenberg.org/files/11/11-0.txt").then(
        (text) => {
          // the Alice in Wonderland text has 1-word sentences, so the machine
          // should always be able to produce exactly 100-word outputs.
          expect(text.split(" ").length).toEqual(100);
          expect(text).not.toEqual("INVALID INPUT: A url is required.");
          expect(text).not.toMatch(
            "Error requesting from https://www.gutenberg.org/files/11/11-0.txt"
          );
        }
      );
    } catch (err) {
      console.log("Error in testing URL\n", err.message);
    }
  });

  test("Text output with invalid filepath", () => {
    let text = markovFromFile("./no_such_file.txt");
    expect(text).toMatch("Error reading from ./no_such_file.txt");
  });

  test("Text output with invalid url", () => {
    markovFromURL("not_a_url").then((text) => {
      expect(text).toMatch("Error requesting from not_a_url");
    });
  });

  test("Text output without filepath", () => {
    let text = markovFromFile();
    expect(text).toEqual("INVALID INPUT: Path to file is required.");
  });

  test("Text output without url", () => {
    markovFromURL().then((text) => {
      expect(text).toMatch("INVALID INPUT: A url is required.");
    });
  });
});
