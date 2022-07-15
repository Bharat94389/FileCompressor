import {bufferSize} from "./ConvertDataToBitString";

const decompress = async (compressedData, hashMap, setProcessing) => {
  // variable to store the compressed data in binary representation
  let bitData = "";
  for(let i=0; i<compressedData.length; i++) {
    bitData += convertToBits(compressedData.charCodeAt(i));
  }

  for(let i=0; i<8; i++) {
    setProcessing(prev => prev + 1);
    await sleep();
  }

  // removing the extra bits added at last to make it a multiple of bufferSize
  let len = bitData.length - 1;
  while(bitData[len] === '0') {
    len--;
  }
  for(let i=0; i<4; i++) {
    setProcessing(prev => prev + 1);
    await sleep();
  }
  let dataAfterDecompression = "", curString = "";

  // iterating through the bit data and storing the character once match is 
  // found in the hashmap
  for(let i=0; i<len; i++) {
    curString += bitData[i];
    if(hashMap[curString]) {
      dataAfterDecompression += String.fromCharCode(hashMap[curString]);
      curString = "";
    }
  }
  for(let i=0; i<18; i++) {
    setProcessing(prev => prev + 1);
    await sleep();
  }

  // returning the original data after decompression
  return dataAfterDecompression;
}

// to convert the provided ASCII value to bit string of length bufferSize
const convertToBits = (asc) => {
  let bits = "";
  for(let i=0; i<bufferSize; i++) {
    bits += Math.floor(asc%2);
    asc/=2;
  }
  return bits;
}

const delay = 100;
const sleep = async () => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export default decompress;