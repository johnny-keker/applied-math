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
    const [charInfo, entropy] = getCharInfoAndEntropy(countChars(text));
    this.setState({ charInfo : charInfo, fileEntropy : entropy });
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
    if (!c.match(/[a-z]/i) && c !== " ")
      c = 'Pnct';
    if (c == " ")
      c = "Spc";
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

export default App;
