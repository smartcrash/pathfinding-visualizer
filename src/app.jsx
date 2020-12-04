import { useState } from 'preact/hooks'

import * as algorithms from './algorithms'
import { Canvas } from './components/Canvas'
import { Grid } from './classes/grid'
import { Node } from './classes/node'

const grid = new Grid(25, 25, (_, index) => new Node({ index }))

export function App() {
  const [start, setStart] = useState(grid.array.get(0, 0))
  const [end, setEnd] = useState(grid.array.get(2, 0))
  const [algorithm, setAlgorithm] = useState(Object.keys(algorithms)[0])
  const [states, setStates] = useState(null)
  const [path, setPath] = useState(null)

  const [isPaused, setIsPaused] = useState(true)
  const [hasFinished, setHasFinished] = useState(false)

  const onButtonClick = () => {
    if (isPaused) {
      const { states, path } = algorithms[algorithm](grid, start, end)

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
        start={start}
        end={end}
        states={states}
        path={path}
        onClick={({ x, y }) => setEnd(grid.array.get(y, x) || end)}
        onFinish={() => setHasFinished(true)}
      />
    </main>
  )
}
