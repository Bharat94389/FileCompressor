import React from 'react';
import getBitStrings, { changeMapToString } from './Compressor';
import convertDataToBitString from './ConvertDataToBitString';
import {saveAs} from 'file-saver';
import decompress from './Decompressor';

const Upload = () => (
  <div className="upload">
    <h2>Upload the file to Compress</h2>
    <form>
      <label for="myfile">Select your file: </label>
      <input type="file" id="compress" name="myfile"/>
      <button onClick={compressFile}>Submit</button>
    </form>
    <h2>Upload the file to Decompress</h2>
    <form>
      <label for="myfile">Select your file: </label>
      <input type="file" id="decompress" name="myfile"/>
      <button onClick={decompessFile}>Submit</button>
    </form>
  </div>
);

const esc = "/";

// Once the submit button is clicked we will start processing the file here
const compressFile = (event) => {
  // here we are storing the data of the file provided by the user into temp variable
  let temp = document.getElementById('compress').files[0];
  
  // to check whether the file is provided to compress or not
  if(temp === undefined) {
    alert('Please enter a file to compress');
  }
  else {
    // Using FileReader to read the file as text
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      // storing the file data into the result variable
      const result = event.target.result;
      
      // getting the map of characters to the bit string with which to replace them
      let charBitMap = getBitStrings(result);

      // getting the actual data after replacing the characters with their bit strings 
      // and converting them to their ascii values by using 7 bits from them at each time
      let bitData = convertDataToBitString(result, charBitMap);

      // storing the map to use it for decompression
      bitData += esc + changeMapToString(charBitMap);

      // using Blob to create a file and provide it to the user to share 
      let blob = new Blob([bitData], {type: "text/plain;charset=utf-8" });
      saveAs(blob, getFileName(temp.name));
    });
    reader.readAsText(temp);
  } 
  // to prevent the default reloading of the page
  event.preventDefault();
}

const decompessFile = (event) => {
  // here we are storing the data of the file provided by the user into temp variable
  let temp = document.getElementById('decompress').files[0];
  
  // to check whether the file is provided to decompress or not
  if(temp === undefined) {
    alert('Please enter a file to decompress');
  }
  else {
    // Using FileReader to read the file as text
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      // storing the file data into the result variable
      const result = event.target.result;
      
      // splitting the result to get the hashmap back
      let arr = result.split(esc);

      // creating the compressed data with the / characters
      let bitData = "";
      for(let i=0; i<arr.length-1; i++)
        bitData += arr[i] + (i!==arr.length-2?esc:"");

      // decompressing the data
      let decompressedData = decompress(bitData, JSON.parse(arr[arr.length-1]));
      
      // using Blob to create a file and provide it to the user to share 
      let blob = new Blob([decompressedData], {type: "text/plain;charset=utf-8" });
      saveAs(blob, getFileName(temp.name, "_de"));
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