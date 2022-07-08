// setting the buffer size to 7 to cover all the ascii values
const bufferSize = 7;

const convertDataToBitString = (originalData, encodedmap) => {
  // to store the binary data after using the encoded map on original data
  let newData = "";

  // iterating through each and every character and changing it to its binary
  // string from the encoded map
  for(let i=0; i<originalData.length; i++) {
    newData += encodedmap[originalData[i]];
  }

  // adding some extra bits so that we can convert the data into buffers 
  // without ignoring any data at last
  newData +='1';
  while(newData.length%bufferSize!==0) {
    newData += '0';
  }
  // this variable will store the ascii value of the buffer from the data
  let compressedData = "";
  
  // iterating through each buffer
  for(let i=0; i<newData.length; i+=bufferSize) {
    // variable to store the decimal value of the buffer
    let curVal = 0;

    // converting the bufffer to its decimal value
    for(let j=0, cur = 1; j<bufferSize; j++, cur*=2) {
      if(newData[i+j]==='1') 
        curVal += cur;
    }

    // adding the ascii character of the decimal value to the data
    compressedData += String.fromCharCode(curVal);
  }
  // returing the compressed data
  return compressedData;
}

export default convertDataToBitString;
export {bufferSize};