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

  const isNotStartOrEnd = node => !node.is(getStart()) && !node.is(getEnd())

  const [walls, setWalls] = useState([])
  const withWalls = (action, node) => {
    if (action === 'reset') {
      setWalls([])
      return
    }

    if (node && isNotStartOrEnd(node)) {
      const state = [...walls]

      switch (action) {
        case 'add':
          node.isWall = true
          if (!state.includes(node)) state.push(node)
          break

        case 'remove':
          node.isWall = false
          state.splice(state.indexOf(node), 1)
          break

        case 'toggle':
          !(node.isWall = !node.isWall)
            ? state.splice(state.indexOf(node), 1)
            : state.push(node)
          break

        default:
          throw new Error('Unexpected action')
      }

      setWalls(state)
    }
  }

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
      withWalls('reset')
      setStates(null)
      setPath(null)
      setIsPaused(true)
      setHasFinished(false)
    }
  }

  const onMouseDragged = ({ x, y, isGrabbing, node }) => {
    if (isGrabbing) node === 'start' ? setStart({ x, y }) : setEnd({ x, y })
    else withWalls('add', grid.array.get(y, x))
  }

  const onMouseClicked = ({ x, y }) => {
    withWalls('toggle', grid.array.get(y, x))
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
        grid={grid}
        rows={grid.rows}
        columns={grid.columns}
        start={getStart()}
        end={getEnd()}
        walls={walls}
        states={states}
        path={path}
        onFinish={() => setHasFinished(true)}
        onMouseDragged={onMouseDragged}
        onMouseClicked={onMouseClicked}
      />
    </main>
  )
}
