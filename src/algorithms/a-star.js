import { dijkstras } from './dijkstras'

const { sqrt, abs } = Math

export const aStar = (grid, start, end) =>
  dijkstras(grid, start, end, {
    heuristic: (a, b) => sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2),
    // heuristic: (a, b) => abs(a.x - b.x) + abs(a.y - b.y),
  })
