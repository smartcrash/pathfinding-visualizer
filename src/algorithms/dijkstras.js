export function dijkstras(grid, start, end, { heuristic = () => 0 } = {}) {
  const { rows, columns } = grid

  const states = []
  const path = []
  const visited = []

  start.distance = 0

  let queue = [start]
  let current

  while ((current = queue.shift())) {
    if (current.is(end)) break

    const state = { visited: null, neighbors: [] }

    visited.push(current)
    current.wasVisited = true

    for (const neighbor of grid.getNeighbors(current.index)) {
      const distance =
        current.distance +
        1 +
        heuristic(
          neighbor.coordinates(rows, columns),
          end.coordinates(rows, columns)
        )

      if (distance < neighbor.distance) {
        neighbor.distance = distance
        neighbor.parent = current
      }

      if (!neighbor.wasVisited && !queue.includes(neighbor)) {
        queue.push(neighbor)
        // TODO: Implement some sort of min heap algorithm
        queue = queue.sort((a, b) => a.distance - b.distance)
        state.neighbors.push(neighbor)
      }
    }

    state.visited = current
    states.push(state)
  }

  if (current && current.is(end)) {
    let parent = end

    while (parent) {
      path.unshift(parent)
      parent = parent.parent
    }
  }

  return { states, path }
}
