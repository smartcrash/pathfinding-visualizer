export function dijkstras(grid, start, end, { heuristic = () => 0 } = {}) {
  const states = []
  const path = []
  const visited = []

  start.distance = 0
  start.score = heuristic(start, end)

  let queue = [start]
  let current

  while ((current = queue.shift())) {
    if (current.is(end)) break

    const state = {
      current: null,
      neighbors: [],
    }

    visited.push(current)

    for (const neighbor of grid.getNeighbors(current.index)) {
      if (neighbor.isWall) continue

      const distance = current.distance + 1

      if (distance < neighbor.distance) {
        neighbor.distance = distance
        neighbor.heuristic = heuristic(neighbor, end)
        neighbor.parent = current
      }

      if (!visited.includes(neighbor) && !queue.includes(neighbor)) {
        // TODO: Implement some sort of min heap algorithm
        queue.push(neighbor)
        queue = queue.sort((a, b) => a.heuristic - b.heuristic)
        state.neighbors.push(neighbor)
      }
    }

    state.current = current
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
