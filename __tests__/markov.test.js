const { MarkovMachine } = require("../markov");

describe("Testing makeChains function", () => {
  test("Chains with normal string input", () => {
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
    expect(Object.keys(markov.chains)).toEqual([
      "A",
      "cat",
      "in",
      "a",
      "hat",
      "with",
      "rat.",
    ]);
    let subChains = Object.values(markov.chains).map((chainObj) => {
      return chainObj.chain;
    });
    expect(subChains).toEqual([
      ["cat"],
      ["in"],
      ["a"],
      ["hat", "rat."],
      ["with"],
      ["a"],
      [null],
    ]);
  });

  test("Chains with empty string input", () => {
    let markov = new MarkovMachine("");
    expect(markov.words).toEqual([]);
    expect(markov.chains).toEqual({});
  });

  test("Chains with single word input", () => {
    let markov = new MarkovMachine("Word.");
    expect(markov.words).toEqual(["Word."]);
    let subChains = Object.values(markov.chains).map((chainObj) => {
      return chainObj.chain;
    });
    expect(subChains).toEqual([[null]]);
  });
});

describe("Testing makeText function", () => {
  test("Output text with expected string input", () => {
    let markov = new MarkovMachine(
      `There was nothing so _very_ remarkable in that; nor did Alice think it
      so _very_ much out of the way to hear the Rabbit say to itself, “Oh
      dear! Oh dear! I shall be late!” (when she thought it over afterwards,
      it occurred to her that she ought to have wondered at this, but at the
      time it all seemed quite natural); but when the Rabbit actually _took a
      watch out of its waistcoat-pocket_, and looked at it, and then hurried
      on, Alice started to her feet, for it flashed across her mind that she
      had never before seen a rabbit with either a waistcoat-pocket, or a
      watch to take out of it, and burning with curiosity, she ran across the
      field after it, and fortunately was just in time to see it pop down a
      large rabbit-hole under the hedge.`
    );
    // Shortest possible full sentence in this is "Oh dear!"
    // The machine always tries to get as close as possible to the given number
    expect(markov.startingWords).toEqual(["There", "Oh", "I", "when"]);
    let text = markov.makeText(10);
    expect(text.split(" ").length).toBeLessThanOrEqual(10);
    expect(text.split(" ").length).toBeGreaterThanOrEqual(8);
    let longerText = markov.makeText(100);
    expect(longerText.split(" ").length).toBeLessThanOrEqual(100);
    expect(longerText.split(" ").length).toBeGreaterThanOrEqual(98);
  });

  test("Output text with empty string input", () => {
    let markov = new MarkovMachine("");
    let text = markov.makeText(10);
    expect(text).toEqual("");
  });

  test("Output text with single-word string input", () => {
    let markov = new MarkovMachine("Word.");
    let text = markov.makeText(3);
    expect(text).toEqual("Word. Word. Word.");
  });

  test("Output text with numerical, non-string input", () => {
    let markov = new MarkovMachine(123);
    let text = markov.makeText(3);
    expect(text).toEqual("123 123 123");
  });
});
