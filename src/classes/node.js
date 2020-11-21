export class Node {
  constructor({
    _id,
    index,
    distance = Infinity,
    weight = 1,
    wasVisited = false,
    isWall = false
  } = {}) {
    this._id = Math.random().toString(36).substr(2, 9);
    this.index = index
    this.distance = distance
    this.weight = weight
    this.wasVisited = wasVisited
    this.isWall = isWall
    this.parent = null
  }

  is(node) {
    return this._id === node._id
  }
}
