// function to convert the original data into a map with values as their frequency
// and the array keys store all the unique keys from the original data
const createMap = (original) => {
  let map = [];
  let keys = [];
  for(let i=0; i<original.length; i++) {
    if(!map[original[i]]) {
      map[original[i]] = 0;
      keys.push(original[i]);
    }
    map[original[i]]++;
  }
  return [map,keys];
}

export default createMap;