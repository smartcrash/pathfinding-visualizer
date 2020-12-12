import { useState } from 'preact/hooks'

import { PIXEL_SIZE } from './constants'
import * as algorithms from './algorithms'
import { Canvas } from './components/Canvas'
import { Grid } from './classes/grid'

const createGrid = () => new Grid(50, 50)
const setCursor = type => (window.document.body.style.cursor = type)
const getCoordinates = ({ mouseX, mouseY, width, height }) => {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height)
    return {
      x: Math.floor(mouseX / PIXEL_SIZE),
      y: Math.floor(mouseY / PIXEL_SIZE),
    }
}

let isDraggingANode = false
let wasDragging = false
let draggedNode = null

export function App() {
  const [isPaused, setIsPaused] = useState(true)
  const [hasFinished, setHasFinished] = useState(false)
  const [grid, setGrid] = useState(createGrid())
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [end, setEnd] = useState({ x: 20, y: 20 })
  const [algorithm, setAlgorithm] = useState(Object.keys(algorithms)[0])
  const [states, setStates] = useState(null)
  const [path, setPath] = useState(null)
  const [walls, setWalls] = useState([])

  const getStart = () => grid.get(start.y, start.x)
  const getEnd = () => grid.get(end.y, end.x)
  const isStartOrEnd = node => node.is(getStart()) || node.is(getEnd())
  const isNotStartOrEnd = node => !isStartOrEnd(node)

  const getHoveredNode = event => {
    const coordinates = getCoordinates(event)

    if (!coordinates) return

    const { x, y } = coordinates

    return grid.get(y, x)
  }

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

  const mouseDragged = event => {
    wasDragging = true

    const node = getHoveredNode(event)

    if (!isDraggingANode) {
      withWalls('add', node)
      return
    }

    if (!node || node.isWall) return

    const coordinates = node.coordinates(grid.rows, grid.columns)

    if (draggedNode === 'start' && !node.is(getEnd())) setStart(coordinates)
    else if (!node.is(getStart())) setEnd(coordinates)
  }

  const mouseMoved = event => {
    if (!isPaused) return

    const node = getHoveredNode(event)

    if (node) setCursor(isStartOrEnd(node) ? 'grab' : 'default')
  }

  const mousePressed = event => {
    if (!isPaused) return

    const node = getHoveredNode(event)

    if (node && isStartOrEnd(node)) {
      isDraggingANode = true
      draggedNode = node.is(getStart()) ? 'start' : 'end'
      setCursor('grabbing')
    }
  }

  const mouseReleased = () => {
    isDraggingANode = false
    draggedNode = null
  }

  const mouseClicked = event => {
    if (!wasDragging) withWalls('toggle', getHoveredNode(event))

    wasDragging = false
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
        listeners={{
          mouseMoved,
          mouseDragged,
          mouseClicked,
          mousePressed,
          mouseReleased,
        }}
      />
    </main>
  )
}
