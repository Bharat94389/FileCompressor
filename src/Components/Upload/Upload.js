import React, { useState } from 'react';
import getBitStrings, { changeMapToString } from './Compressor';
import convertDataToBitString from './ConvertDataToBitString';
import { saveAs } from 'file-saver';
import decompress from './Decompressor';

const Upload = ({ setProcessing, setType }) => {
  const [fileName, setFileName] = useState("");
  const addOver = (e) => {
    e.preventDefault();
    document.getElementById('container').classList.add('input-file-container-over')
  }
  const removeOver = (e) => {
    e.preventDefault();
    document.getElementById('container').classList.remove('input-file-container-over')
  }
  const setFile = (e) => {
    e.preventDefault();
    document.getElementById('container').classList.remove('input-file-container-over')
    document.getElementById('file').files = e.dataTransfer.files;
    setFileName(e.dataTransfer.files[0].name);
  }
  return (
    <div>
      <div className="container">
        <div className="upload">
          <div id='container' className="input-file-container" onDragOver={addOver} onDragEnd={removeOver} onDragLeave={removeOver} onDrop={setFile}>
            <div className='container-text'>
              <div className="input-file-container-text">Drop or Select to upload text file</div>
              <input type="file" id="file" onChange={(e) => setFileName(e.target.files[0].name)} />
              <button className="input-clone" onClick={() => document.getElementById('file').click()}>
                Select File
              </button>
              <div className='filename'>{fileName}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='btn-container'>
        <button className='btn' onClick={(event) => compressFile(event, setProcessing, setType, setFileName)}>Compress</button>
        <button className='btn' onClick={(event) => decompressFile(event, setProcessing, setType, setFileName)}>Decompress</button>
      </div>
    </div>
  );
}

const esc = "/", delay = 50;
const sleep = async () => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Once the submit button is clicked we will start processing the file here
const compressFile = (event, setProcessing, setType, setFileName) => {
  setProcessing(0);
  setType("Compressing");
  // here we are storing the data of the file provided by the user into temp variable
  let temp = document.getElementById('file').files[0];
  
  // to check whether the file is provided to compress or not
  if(temp === undefined) {
    alert('Please enter a file to compress');
  }
  else {
    // Using FileReader to read the file as text
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
      // storing the file data into the result variable
      const result = event.target.result;
      for(let i=0; i<8; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }

      // getting the map of characters to the bit string with which to replace them
      let charBitMap = getBitStrings(result);
      for(let i=0; i<7; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }

      // getting the actual data after replacing the characters with their bit strings 
      // and converting them to their ascii values by using 7 bits from them at each time
      let bitData = convertDataToBitString(result, charBitMap);
      for(let i=0; i<30; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }

      // storing the map to use it for decompression
      bitData += esc + changeMapToString(charBitMap);
      for(let i=0; i<40; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }

      // using Blob to create a file and provide it to the user to share 
      let blob = new Blob([bitData], {type: "text/plain;charset=utf-8" });
      for(let i=0; i<15; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }
      saveAs(blob, getFileName(temp.name));
      setProcessing(-1);
      setType("");
      setFileName("");
    });
    reader.readAsText(temp);
  } 
  // to prevent the default reloading of the page
  event.preventDefault();
}

const decompressFile = (event, setProcessing, setType, setFileName) => {
  setProcessing(0);
  setType("Decompressing");
  // here we are storing the data of the file provided by the user into temp variable
  let temp = document.getElementById('file').files[0];
  
  // to check whether the file is provided to decompress or not
  if(temp === undefined) {
    alert('Please enter a file to decompress');
  }
  else {
    // Using FileReader to read the file as text
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
      // storing the file data into the result variable
      const result = event.target.result;
      for(let i=0; i<25; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }
      // splitting the result to get the hashmap back
      let arr = result.split(esc);
      // creating the compressed data with the / characters
      let bitData = "";
      for(let i=0; i<arr.length-1; i++) {
        bitData += arr[i] + (i!==arr.length-2?esc:"");
      }
      for(let i=0; i<30; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }
      // decompressing the data
      let decompressedData = await decompress(bitData, JSON.parse(arr[arr.length-1]), setProcessing);
    
      // using Blob to create a file and provide it to the user to share 
      let blob = new Blob([decompressedData], {type: "text/plain;charset=utf-8" });
      for(let i=0; i<15; i++) {
        setProcessing(prev => prev + 1);
        await sleep();
      }
      saveAs(blob, getFileName(temp.name, "_de"));
      setProcessing(-1);
      setType("");
      setFileName("");
    });
    reader.readAsText(temp);
  } 
  // to prevent the default reloading of the page
  event.preventDefault();
}

// to get the actual file name and convert it into filename_compressed.txt
const getFileName = (originalName, extra = "_") => {
  return originalName.split('.')[0] + extra + "compressed.txt";
}

export default Upload;