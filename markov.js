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
    let finalText = [];
    while (finalText.length < numWords) {
      let chainArray = [];
      let wordsLeft = numWords - finalText.length;
      traverseChain(this.chains, chainArray, wordsLeft);
      chainArray[0] =
        chainArray[0].charAt(0).toUpperCase() + chainArray[0].slice(1);
      finalText = finalText.concat(chainArray);
    }
    return finalText.join(" ");
  }
}

function removePunctuation(str) {
  let punct =
    "[\\!\"#\\$%&\\'\\(\\)\\*\\+,-\\.\\/:;<=>\\?@\\[\\]\\^_`{\\|}~\\\\]+";
  let regex = new RegExp(`(?<=(\\s|^))${punct}|${punct}(?=(\\s|$))`, "g");
  return str.replace(regex, "");
}

function traverseChain(chainObj, targetArray, maxLength) {
  if (targetArray.length === 0) {
    let chainStarts = Object.keys(chainObj);
    let wordIndex = Math.floor(Math.random() * chainStarts.length);
    targetArray.push(chainStarts[wordIndex]);
    traverseChain(chainObj, targetArray, maxLength);
  } else {
    let nextChain = chainObj[targetArray[targetArray.length - 1]];
    if (nextChain[0] !== null && targetArray.length < maxLength) {
      let nextWordIndex = Math.floor(Math.random() * nextChain.length);
      targetArray.push(nextChain[nextWordIndex]);
      traverseChain(chainObj, targetArray, maxLength);
    } else {
      targetArray[targetArray.length - 1] += ".";
    }
  }
}

module.exports = { MarkovMachine };
