function countChars(fileContents) {
  var charMap = {a};
  fileContents.split("").forEach(c => {
    c = c.toLowerCase();                    // translate every char to lower case to make code case insensitive
    if (!c.match(/[a-z0-9]/i) && c !== " ") // checking if char is a punctuation
      c = '.';
    if (c == "\n")                          // removing newline symbols
      return;
    if (charMap[c] !== undefined)           // adding char to map
      charMap[c]++;
    else
      charMap[c] = 1;
  });
  return charMap;
}

function getCharInfoAndEntropy(charMap) {
  var probMap = {};
  var entropy = 0;
  const size = Object.values(charMap).reduce((a, b) => a + b, 0);
  Object.entries(charMap).forEach(([char, frequency]) => {
    var prob = frequency / size;                                  // calculating current char probability
    probMap[char] = [prob, Math.log(1 / prob)];                   // setting probability and entropy for char
    entropy -= prob * Math.log(prob);                             // updating file entropy
  });
  return [probMap, entropy];
}

function getPairsEntropy(fileContents, charProbs) {
  fileContents = fileContents.replace("\n", "").toLowerCase();    // making code case insensitive and removing newline symbols
  var pairCount = {};
  const size = fileContents.length - 1;
  for (var i = 0; i < size; i++) {                                // iterating over file contents by two symbols
    var fChar = fileContents[i];
    var sChar = fileContents[i+1];
    if (!fChar.match(/[a-z0-9]/i) && fChar !== " ") fChar = ".";  // checking if any char of pair is a punctuation
    if (!sChar.match(/[a-z0-9]/i) && sChar !== " ") sChar = ".";
    var pair = fChar + sChar;
    if (pairCount[pair] === undefined)                            // adding pair to map
      pairCount[pair] = 1;
    else
      pairCount[pair] += 1;
  }
  var pairEntropy = 0;
  Object.entries(pairCount).forEach(([pair, frequency]) => {
    var pairProb = frequency / size;                                        // calculating probability for every pair
    pairEntropy -= pairProb * charProbs[pair[1]][0] * Math.log2(pairProb);  // updating file entropy
  });
  return pairEntropy;
}
