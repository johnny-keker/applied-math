import React from 'react';
import logo from './logo.svg';
import './App.css';
import { async } from 'q';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            { this.state.text }
        </p>
          <div id="json-file-loader">
            <input type="file" ref="file" />
          </div>
          <button onClick={this.openFile}>Load File</button>
        </header>
      </div>
    );
  }

  openFile = async () => {
    const rawFile = await readFileAsync(this.refs.file.files[0]);
    const text = arrayBufferToString(rawFile);
    const charMap = countChars(text);
    var formattedText = "";
    charMap.forEach((frequency, char, _) => {
      formattedText += `${char} : ${frequency} || `;
    });
    this.setState({ text : formattedText });
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
  var charMap = new Map();
  fileContents.split("").forEach(c => {
    if (charMap.has(c))
      charMap.set(c, charMap.get(c) + 1);
    else
      charMap.set(c, 1);
  });
  return charMap;
}

export default App;
