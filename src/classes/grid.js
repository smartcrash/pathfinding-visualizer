import ndarray from 'ndarray'

const createArray = (length, iterator) => Array.from({ length }).map(iterator)
const isNotEmpty = value => value !== null && value !== undefined

export class Grid {
  constructor(rows = 25, columns = 25, iterator = () => {}) {
    this.rows = rows
    this.columns = columns
    this.array = ndarray(createArray(rows * columns, iterator), [rows, columns])
  }

  getNeighbors(index) {
    const { rows, columns, array } = this

    const row = Math.floor(index / columns)
    const column = index % columns

    let top
    let right
    let bottom
    let left

    if (row > 0) top = array.get(row - 1, column)
    if (column < columns - 1) right = array.get(row, column + 1)
    if (row < rows - 1) bottom = array.get(row + 1, column)
    if (column > 0) left = array.get(row, column - 1)

    return [top, right, bottom, left].filter(isNotEmpty)
  }
}
