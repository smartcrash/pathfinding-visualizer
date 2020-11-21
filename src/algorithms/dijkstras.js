export function dijkstras(grid, start, end) {
  const path = []
  const visited = [] // Array of visited nodes, at start is empty

  start.distance = 0

  let queue = [start] // Queue containing  start node only
  let current

  while ((current = queue.shift())) {
    if (current.is(end)) break

    visited.push(current)
    current.wasVisited = true

    for (const neighbor of grid.getNeighbors(current.index)) {
      const distance = current.distance + 1

      if (distance < neighbor.distance) {
        neighbor.distance = distance
        neighbor.parent = current
      }

      if (!neighbor.wasVisited && !queue.includes(neighbor)) {
        queue.push(neighbor)
        // TODO: Implement some sort of min heap algorithm
        queue = queue.sort((a, b) => a.distance + b.distance)
      }
    }
  }

  // Shortest path founded
  if (current && current.is(end)) {
    let parent = end

    while (parent) {
      path.unshift(parent)
      parent = parent.parent
    }
  }

  return { visited, path }
}
