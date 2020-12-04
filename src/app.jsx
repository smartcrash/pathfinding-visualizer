import { useState } from 'preact/hooks'

import * as algorithms from './algorithms'
import { Canvas } from './components/Canvas'
import { Grid } from './classes/grid'
import { Node } from './classes/node'

const createGrid = () => new Grid(25, 25, (_, index) => new Node({ index }))

export function App() {
  const [grid, setGrid] = useState(createGrid())
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [end, setEnd] = useState({ x: 20, y: 20 })
  const [algorithm, setAlgorithm] = useState(Object.keys(algorithms)[0])
  const [states, setStates] = useState(null)
  const [path, setPath] = useState(null)

  const [isPaused, setIsPaused] = useState(true)
  const [hasFinished, setHasFinished] = useState(false)

  const getStart = () => grid.array.get(start.y, start.x)
  const getEnd = () => grid.array.get(end.y, end.x)

  const onButtonClick = () => {
    if (isPaused) {
      setGrid(createGrid())
      const { states, path } = algorithms[algorithm](grid, getStart(), getEnd())
      setStates(states)
      setPath(path)
      setIsPaused(false)
      setHasFinished(false)
    }

    if (hasFinished) {
      setStates(null)
      setPath(null)
      setIsPaused(true)
      setHasFinished(false)
    }
  }

  return (
    <main class="flex items-center justify-center flex-col">
      <h1>{algorithm}</h1>

      <button onClick={onButtonClick}>
        {hasFinished ? 'RESTART' : isPaused ? 'START' : 'RUNNING'}
      </button>

      <select onChange={e => setAlgorithm(e.target.value)}>
        {Object.keys(algorithms).map(key => (
          <option value={key}>{key}</option>
        ))}
      </select>

      <Canvas
        paused={isPaused}
        rows={grid.rows}
        columns={grid.columns}
        start={getStart()}
        end={getEnd()}
        states={states}
        path={path}
        onClick={setEnd}
        onFinish={() => setHasFinished(true)}
      />
    </main>
  )
}
