/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter((c) => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};
    this.words.forEach((word, index) => {
      let key = removePunctuation(word.toLowerCase());
      let nextWord = this.words[index + 1];
      if (nextWord) {
        nextWord = removePunctuation(nextWord.toLowerCase());
      } else {
        nextWord = null;
      }
      if (!this.chains[key]) {
        this.chains[key] = [nextWord];
      } else {
        this.chains[key].push(nextWord);
      }
    });
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    // TODO
  }
}

function removePunctuation(str) {
  let punct =
    "[\\!\"#\\$%&\\'\\(\\)\\*\\+,-\\.\\/:;<=>\\?@\\[\\]\\^_`{\\|}~\\\\]+";
  let regex = new RegExp(`(?<=(\\s|^))${punct}|${punct}(?=(\\s|$))`, "g");
  return str.replace(regex, "");
}

module.exports = { MarkovMachine };
