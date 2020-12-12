import ndarray from 'ndarray'

const createArray = ([rows, columns], iterator) =>
  ndarray(
    Array.from({
      length: rows * columns,
    }).map(iterator),
    [rows, columns]
  )

const isNotEmpty = value => value !== null && value !== undefined

export class Grid {
  constructor(rows = 25, columns = 25, iterator = () => {}) {
    this.rows = rows
    this.columns = columns

    const array = createArray([rows, columns], iterator)
    Object.assign(this, array)
    Object.assign(this.__proto__, array.__proto__)
  }

  getNeighbors(index) {
    const rows = this.rows
    const columns = this.columns

    const row = Math.floor(index / columns)
    const column = index % columns

    let top
    let right
    let bottom
    let left

    if (row > 0) top = this.get(row - 1, column)
    if (column < columns - 1) right = this.get(row, column + 1)
    if (row < rows - 1) bottom = this.get(row + 1, column)
    if (column > 0) left = this.get(row, column - 1)

    return [top, right, bottom, left].filter(isNotEmpty)
  }
}
