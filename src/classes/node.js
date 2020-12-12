export class Node {
  constructor({ index, x, y, weight = 1 } = {}) {
    this._id = Math.random().toString(36).substr(2, 9)
    this.index = index
    this.x = x
    this.y = y
    this.distance = Infinity
    this.heuristic = Infinity
    this.weight = weight
    this.isWall = false
    this.parent = null
  }

  is(node) {
    return this._id === node._id
  }

  coordinates(rows, columns) {
    const { index } = this

    const x = index % columns
    const y = Math.floor(index / rows)

    return { x, y }
  }
}
