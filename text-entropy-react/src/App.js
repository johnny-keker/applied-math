import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      probabilities: {}
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
          <div id="json-file-loader">
            <input type="file" ref="file" />
          <button onClick={this.openFile}>Load File</button>
          </div>
          <table className="table">
            <tbody>
              <tr>
                { Object.entries(this.state.probabilities).map(([key, value]) => (<td>{key}</td>)) }
              </tr>
              <tr>
                { Object.entries(this.state.probabilities).map(([key, value]) => (<td>{value.toFixed(3)}</td>)) }
              </tr>
        </tbody>
      </table>
    </div>
        </header>
      </div>
    );
  }

  openFile = async () => {
    const rawFile = await readFileAsync(this.refs.file.files[0]);
    const text = arrayBufferToString(rawFile);
    const probMap = countProbability(countChars(text));
    this.setState({ probabilities : probMap });
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
    if (".,;?!:-".includes(c))    // TODO: do it better
      c = 'Punctuation';
    if (charMap[c] !== undefined)
      charMap[c]++;
    else
      charMap[c] = 1;
  });
  return charMap;
}

function countProbability(charMap) {
  var probMap = {};
  const size = Object.values(charMap).reduce((a, b) => a + b, 0);
  Object.entries(charMap).forEach(([char, frequency]) => {
    probMap[char] = frequency / size;
  });
  return probMap;
}

export default App;
