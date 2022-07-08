import PriorityQueue from "./PriorityQueue";
import createMap from "./CreateMap";
import HuffmanNode from "./HuffmanNode";

// to return the encoded values of all the unique keys from the original data
const compress = (original) => {
  // to get the frequency and unique keys from the data
  let [hashMap, keys] = createMap(original);
  
  // to store the encoded values of the keys
  let enval = [];

  // taking only 1 key as a special case
  if(keys.length === 1) {
    enval[keys[0]] = '1';
    return enval;
  }

  // priority queue to get the smallest frequency characters first
  let queue = new PriorityQueue();

  // storing all the frequency and keys into the priority queue 
  // to store the data we are using a huffman node class
  for(let i=0; i<keys.length;i++) {
    let node = new HuffmanNode();
    node.setData(hashMap[keys[i]], keys[i]);
    queue.push(node);
  }

  // taking the top two element with min frequency in the priority queue 
  // and inserting a new node with the frequency as sum of these two frequencies
  // and pushing it back into the priority queue until we are left with just one node
  while(queue.size()>1) {
      let x=queue.pop();
      let y=queue.pop();
    
      let node=new HuffmanNode();
      node.setData(x.data+y.data, '#', x, y);
      queue.push(node);
  }

  // the last node is the root of our tree so starting to convert the keys into their
  // bit strings in the encode function
  encode(queue.peek(), enval);
  queue.pop();

  // return the bit map 
  return enval;
}

// function to convert the keys into bit strings
const encode = (root, enval, cur = '') => {
  // if both the roots are null that means it is a leaf node so storing the data
  // of this character into the map
  if(root && root.left==null && root.right==null) {
    enval[root.c] = cur;
    return;
  }

  // if both roots are not null that means it is an inner node so going further 
  // down the tree to get to the leaf
  if(root && root.left!=null) {
    encode(root.left, enval, cur + '0');
  }
  if(root && root.right!=null) {
    encode(root.right, enval, cur + '1');
  }
}

// to change the map into a string to store with the data for decompression
const changeMapToString = (charBitMap) => {
  let obj = {};
  for(let i=0; i<128; i++) {
    if(charBitMap[String.fromCharCode(i)]) {
      obj[charBitMap[String.fromCharCode(i)]] = i;
    }
  }
  return JSON.stringify(obj);
}

export default compress;
export {changeMapToString};