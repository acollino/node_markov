/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    this.storeWords(text);
    this.makeChains();
    this.filterStartingKeys();
  }

  storeWords(text) {
    let usableInput = removeExcessPunctuation(text);
    let splitWords = usableInput.split(/[ \r\n]+/);
    this.words = splitWords.filter((c) => c !== "");
  }

  /** set markov chains:
   *
   *  for text of "the cat, in the hat. how's that! word"
   * ["the", "cat,", "in", "the", "hat.", "how's", "that!", "word"]
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */
  makeChains() {
    this.chains = {};
    let newSentence = true;
    let chainWordKeys = new Set();
    this.words.forEach((word, index) => {
      let key = word;
      chainWordKeys.add(key);
      let nextWord = this.words[index + 1];
      let currentChain = this.chains[key];
      if (!currentChain) {
        currentChain = new MarkovChain(key, { start: newSentence });
        this.chains[key] = currentChain;
      }
      if (!nextWord || currentChain.end) {
        nextWord = null;
        currentChain.end = true;
      }
      if (!currentChain.chain.includes(nextWord)) {
        currentChain.chain.push(nextWord);
      }
      if (currentChain.end) {
        this.setEndingDistance(chainWordKeys);
        chainWordKeys.clear();
      }
      newSentence = currentChain.end;
    });
  }
  /**
   * Given a set of keys for the MarkovMachine's chain property,
   * record the the distance to an ending word for each key. This
   * will be used to ensure the makeText function provides the
   * appropriate number of words in the logged text.
   */
  setEndingDistance(keySet) {
    let keyArray = Array.from(keySet);
    for (let x = keyArray.length - 1; x >= 0; x--) {
      let distance = keyArray.length - 1 - x;
      let currentDistance = this.chains[keyArray[x]].endingDistance;
      if (currentDistance == null || currentDistance > distance) {
        this.chains[keyArray[x]].endingDistance = distance;
      }
    }
  }

  // Store an array of words that can be used as sentence starters.
  filterStartingKeys() {
    this.startingWords = Object.keys(this.chains).filter(
      (key) => this.chains[key].start
    );
  }

  /** return random text from chains */
  makeText(numWords = 100) {
    let finalText = [];
    while (finalText.length < numWords) {
      let chainArray = [];
      let wordsLeft = numWords - finalText.length;
      let intialLength = finalText.length;
      this.traverseChain(chainArray, wordsLeft);
      chainArray[0] =
        chainArray[0].charAt(0).toUpperCase() + chainArray[0].slice(1);
      finalText = finalText.concat(chainArray);
      if (intialLength === finalText.length) {
        // infinite loops if nothing can be added from the chains
        break;
      }
    }
    return finalText.join(" ");
  }

  /**
   * Recursively iterate along a chain, filling the targetArray with
   * the chosen words.
   */
  traverseChain(targetArray, maxLength) {
    if (targetArray.length === 0) {
      let startOptions = this.startingWords.filter((key) => {
        return this.chains[key].endingDistance < maxLength - targetArray.length;
      });
      let wordIndex = Math.floor(Math.random() * startOptions.length);
      targetArray.push(startOptions[wordIndex]);
      this.traverseChain(targetArray, maxLength);
    } else {
      let nextChain = this.chains[
        targetArray[targetArray.length - 1]
      ].chain.filter((key) => {
        return (
          key !== null &&
          this.chains[key].endingDistance < maxLength - targetArray.length
        );
      });
      if (nextChain[0] != null && targetArray.length < maxLength) {
        let nextWordIndex = Math.floor(Math.random() * nextChain.length);
        targetArray.push(nextChain[nextWordIndex]);
        this.traverseChain(targetArray, maxLength);
      }
    }
  }
}

/**
 * A class representing a single Markov chain, it describes
 * the starting word, the following chain, and whether the
 * starting word can act as the start or end of a sentence.
 */
class MarkovChain {
  constructor(startingWord, positionDetails = {}) {
    this.startingWord = startingWord;
    this.start = Boolean(positionDetails.start);
    this.end = this.isEnd();
    this.chain = [];
  }

  isEnd() {
    return this.startingWord.search(/[\\!\\.\\?]$/) !== -1;
  }
}

/**
 * Removes punctuation that could be confusing if left in the
 * string when generating text (ie half of a “” or () pair).
 * Demonstration available at https://regex101.com/r/rt0Zv1/1
 */
function removeExcessPunctuation(str) {
  let punctToRemove =
    '[\\"“”#\\$%&\\(\\)\\*\\+\\-\\/<=>@\\[\\]\\^_`{\\|}~\\\\]+';
  let punctToKeep = `[\\!\\.\\?]`;
  let lookBehind = `(?<=\\s|^|${punctToKeep})${punctToRemove}`;
  let lookAhead = `${punctToRemove}(?=\\s|$|${punctToKeep})`;
  let regex = new RegExp(`${lookBehind}|${lookAhead}`, "g");
  return str.replace(regex, "");
}

module.exports = { MarkovMachine };
