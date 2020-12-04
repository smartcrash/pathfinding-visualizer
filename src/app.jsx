import { Canvas } from './components/Canvas'
import { Grid } from './classes/grid'
import { Node } from './classes/node'
import { dijkstras } from './algorithms/dijkstras'
import { aStar } from './algorithms/a-star'

const grid = new Grid(25, 25, (_, index) => new Node({ index }))
const start = grid.array.get(0, 0)
const end = grid.array.get(0, 24)

const { states, path } = aStar(grid, start, end)

export function App() {
  return (
    <main class="flex items-center justify-center h-screen">
      <Canvas
        rows={grid.rows}
        columns={grid.columns}
        start={start}
        end={end}
        states={states}
        path={path}
      />
    </main>
  )
}
