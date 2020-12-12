import { dijkstras } from './dijkstras'

export const aStar = (grid, start, end) =>
  dijkstras(grid, start, end, {
    heuristic: (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2),
  })
