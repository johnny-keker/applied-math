import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      charInfo: {},
      fileEntropy: 0,
      pairEntropy: 0,
      texTable: []
    };
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div>
            <div>
          <div id="json-file-loader">
            <input type="file" ref="file" />
            <button onClick={this.openFile}>Load File</button>
          </div>
          <p>Total File Entropy: {this.state.fileEntropy.toFixed(4)}</p>
          <p>Entropy H*: {this.state.pairEntropy.toFixed(4)}</p>
        </div>
      </div>
          <table className="table">
            <tbody>
              <tr><th>Char</th><th>Prob</th><th>Entropy</th></tr>
              { Object.keys(this.state.charInfo).sort().map((key) => (<tr><td>{key}</td><td>{this.state.charInfo[key][0].toFixed(4)}</td><td>{this.state.charInfo[key][1].toFixed(4)}</td></tr>)) }
        </tbody>
      </table>
      <div className="texTable">
        {this.state.texTable.map((line) => <p>{line}</p>)}
      </div>
    </div>
      </div>
    );
  }

  openFile = async () => {
    const rawFile = await readFileAsync(this.refs.file.files[0]);
    const text = arrayBufferToString(rawFile);
    const charMap = countChars(text);
    const [charInfo, entropy] = getCharInfoAndEntropy(charMap);
    const pairEntropy = getPairsEntropy(text, charInfo);
    const texTable = exportTex(charInfo);
    this.setState({ charInfo : charInfo, fileEntropy : entropy, pairEntropy : pairEntropy, texTable : texTable });
  }

}

function exportTex(charInfo) {
  var texTable = [];
  texTable.push("\\begin{tabular}{ | l | l | l | }");
  texTable.push("\\hline");
  texTable.push("Символ & Вероятность & Энтропия \\\\"); 
  texTable.push("\hline");
  Object.entries(charInfo).forEach(([char, info]) => {
    texTable.push(`${char} & ${info[0].toFixed(4)} & ${info[1].toFixed(4)} \\\\`);
  });
  texTable.push("\\hline");
  texTable.push("\\end{tabular}");
  return texTable;
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function arrayBufferToString(arrayBuffer) {
  return new TextDecoder('utf-8').decode(arrayBuffer);
}

function countChars(fileContents) {
  var charMap = {};
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

export default App;
