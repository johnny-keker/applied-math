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
    };
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div>
          <div id="json-file-loader">
            <input type="file" ref="file" />
            <button onClick={this.openFile}>Load File</button>
          </div>
          <p>Total File Entropy: {this.state.fileEntropy.toFixed(4)}</p>
          <p>Entropy H*: {this.state.pairEntropy.toFixed(4)}</p>
        </div>
          <table className="table">
            <tbody>
              <tr><th>Char</th><th>Prob</th><th>Entropy</th></tr>
              { Object.keys(this.state.charInfo).sort().map((key) => (<tr><td>{key}</td><td>{this.state.charInfo[key][0].toFixed(4)}</td><td>{this.state.charInfo[key][1].toFixed(4)}</td></tr>)) }
        </tbody>
      </table>
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
    this.setState({ charInfo : charInfo, fileEntropy : entropy, pairEntropy : pairEntropy });
  }
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
    c = c.toLowerCase();
    if (!c.match(/[a-z0-9]/i) && c !== " ")
      c = '.';
    if (c == "\n")
      return;
    if (charMap[c] !== undefined)
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
    var prob = frequency / size;
    probMap[char] = [prob, Math.log(1 / prob)];
    entropy -= prob * Math.log(prob);
  });
  return [probMap, entropy];
}

function getPairsEntropy(fileContents, charProbs) {
  fileContents = fileContents.replace("\n", "").toLowerCase();
  var pairCount = {};
  const size = fileContents.length - 1;
  for (var i = 0; i < size; i++) {
    var fChar = fileContents[i];
    var sChar = fileContents[i+1];
    if (!fChar.match(/[a-z0-9]/i) && fChar !== " ") fChar = ".";
    if (!sChar.match(/[a-z0-9]/i) && sChar !== " ") sChar = ".";
    var pair = fChar + sChar;
    if (pairCount[pair] === undefined)
      pairCount[pair] = 1;
    else
      pairCount[pair] += 1;
  }
  var pairEntropy = 0;
  Object.entries(pairCount).forEach(([pair, frequency]) => {
    var pairProb = frequency / size;
    pairEntropy -= pairProb * charProbs[pair[1]][0] * Math.log2(pairProb);
  });
  return pairEntropy;
}

export default App;
