import React from 'react'
import Sketch from 'react-p5'

const SIZE = 18
let index = 0

export function Canvas({ rows, columns, start, end, states, path }) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(rows * SIZE, columns * SIZE).parent(canvasParentRef)
    p5.background(255)
    p5.stroke(180)
    p5.frameRate(35)
  }

  const draw = p5 => {
    if (index === states.length) {
      const nodes = path.map(node => node.coordinates(rows, columns))
      p5.noFill()
      p5.stroke(0, 0, 255)
      p5.beginShape()
      p5.strokeWeight(SIZE / 2)

      for (const { x, y } of nodes)
        p5.vertex(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2)

      p5.endShape()
      p5.noLoop()

      return
    }

    const state = states[index]
    const visited = state.visited.coordinates(rows, columns)
    const neighbors = state.neighbors.map(node =>
      node.coordinates(rows, columns)
    )

    for (const { x, y } of neighbors) {
      p5.line(
        visited.x * SIZE + SIZE / 2,
        visited.y * SIZE + SIZE / 2,
        x * SIZE + SIZE / 2,
        y * SIZE + SIZE / 2
      )
    }

    for (const { x, y } of [visited, ...neighbors]) {
      p5.fill('white')
      p5.ellipse(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, SIZE / 2)
    }

    p5.fill('red')
    p5.ellipse(
      visited.x * SIZE + SIZE / 2,
      visited.y * SIZE + SIZE / 2,
      SIZE / 2
    )

    const { x, y } = end.coordinates(rows, columns)
    p5.fill(0, 255, 0)
    p5.ellipse(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, SIZE / 2)

    ++index
  }

  return <Sketch setup={setup} draw={draw} />
}
