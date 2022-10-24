/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.storeWords(words);
    this.makeChains();
  }

  storeWords(wordArray) {
    let filtered = wordArray.filter((c) => c !== "");
    this.words = filtered.map((word, index) => {
      let currentWord;
      if (index === 0) {
        currentWord = new MarkovWord(removeExcessPunctuation(word), true);
      } else {
        currentWord = new MarkovWord(removeExcessPunctuation(word));
      }
      if (index === wordArray.length - 1 && !currentWord.isEnd) {
        currentWord.isEnd = true;
      }
      return currentWord;
    });
  }

  parseInputString(inputStr) {
    let splitWords = inputStr.split(/[ \r\n]+/);
    this.words = [];
    // let sentenceStartRegex = /(?<=^|[\\!\\.\\?]\s)\S+/g;
    let sentenceEndRegex = /\S+(?=[\\!\\.\\?]\s|[\\!\\.\\?]$)/g;
    let indices = { split: 0, text: 0 };
    while (indices.text < inputStr.length) {
      // let start = sentenceStartRegex.exec(text);
      let end = sentenceEndRegex.exec(inputStr);
      if (end === null) {
        end = {
          index: inputStr.length - splitWords[splitWords.length - 1].length,
        };
      }
      // Condition for 1-word inputs, so both start + end
      if (end.index === indices.text) {
        this.addMarkovWord(splitWords, indices, { start: true, end: true });
      } else {
        this.addMarkovWord(splitWords, indices, { start: true, end: false });
        while (indices.text !== end.index) {
          this.addMarkovWord(splitWords, indices, { start: false, end: false });
        }
        this.addMarkovWord(splitWords, indices, { start: false, end: true });
      }
    }
  }

  addMarkovWord(wordArray, indexObject, positionObject) {
    let word = removeExcessPunctuation(wordArray[indexObject.split]);
    let markWord = new MarkovWord(word, positionObject);
    this.words.push(markWord);
    indexObject.split++;
    indexObject.text += word.length + 1;
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */
  makeChains() {
    this.chains = {};
    this.words.forEach((markWord, index) => {
      let key = markWord.word;
      let nextWord = this.words[index + 1];
      if (nextWord) {
        nextWord = nextWord.word;
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

class MarkovWord {
  constructor(word, positionDetails = {}) {
    this.word = word;
    this.start = Boolean(positionDetails.start);
    this.end = Boolean(positionDetails.end);
  }

  isEnd() {
    return this.word.match(/[\\!\\.\\?]$/);
  }
}

function removePunctuation(str) {
  let punct =
    "[\\!\"#\\$%&\\'\\(\\)\\*\\+,-\\.\\/:;<=>\\?@\\[\\]\\^_`{\\|}~\\\\]+";
  let regex = new RegExp(`(?<=(\\s|^))${punct}|${punct}(?=(\\s|$))`, "g");
  return str.replace(regex, "");
}

function removeExcessPunctuation(str) {
  let punct = '[\\"#\\$%&\\(\\)\\*\\+\\-\\/<=>@\\[\\]\\^_`{\\|}~\\\\]+';
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

module.exports = { MarkovMachine, removeExcessPunctuation };
