const { MarkovMachine } = require("../markov");

describe("Testing makeChains function", () => {
  test("Output with normal string input", () => {
    let markov = new MarkovMachine("A cat in a hat with a rat.");
    expect(markov.words).toEqual([
      "A",
      "cat",
      "in",
      "a",
      "hat",
      "with",
      "a",
      "rat.",
    ]);
    let chains = markov.chains;
    expect(Object.keys(chains)).toEqual([
      "a",
      "cat",
      "in",
      "hat",
      "with",
      "rat",
    ]);
    expect(Object.values(chains)).toEqual([
      ["cat", "hat", "rat"],
      ["in"],
      ["a"],
      ["with"],
      ["a"],
      [null],
    ]);
  });

  test("Output with empty string input", () => {
    let markov = new MarkovMachine("");
    expect(markov.words).toEqual([]);
    expect(markov.chains).toEqual({});
  });

  test("Output with single word input", () => {
    let markov = new MarkovMachine("Word.");
    expect(markov.words).toEqual(["Word."]);
    expect(markov.chains).toEqual({ word: [null] });
  });
});
