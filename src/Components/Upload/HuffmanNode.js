// class used as a node in the tree generated in huffman algorithm
class HuffmanNode{

  HuffmanNode() {
    this.data = 0;
    this.c = '';
    this.left = null; 
    this.right = null;
  }

  setData(data, c, left = null, right = null) {
    this.data = data;
    this.c = c;
    this.left = left; 
    this.right = right;
  }
}
export default HuffmanNode;