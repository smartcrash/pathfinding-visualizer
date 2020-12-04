import React from 'react'
import Sketch from 'react-p5'

const SIZE = 18
let index = 0

export function Canvas({
  paused,
  rows,
  columns,
  start,
  end,
  states,
  path,
  onClick = () => null,
  onFinish = () => null,
}) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(rows * SIZE, columns * SIZE).parent(canvasParentRef)
    p5.background(255)
    p5.frameRate(35)
  }

  const draw = p5 => {
    p5.stroke(180)
    p5.strokeWeight(1)

    if (paused) {
      p5.stroke(180)
      p5.fill(255)
      p5.rect(0, 0, p5.width, p5.height, SIZE / 2)

      p5.fill(0, 255, 0)
      p5.ellipse(
        end.coordinates(rows, columns).x * SIZE + SIZE / 2,
        end.coordinates(rows, columns).y * SIZE + SIZE / 2,
        SIZE / 2
      )

      p5.fill('red')
      p5.ellipse(
        start.coordinates(rows, columns).x * SIZE + SIZE / 2,
        start.coordinates(rows, columns).y * SIZE + SIZE / 2,
        SIZE / 2
      )

      return
    }

    if (index === states.length) {
      p5.noFill()
      p5.stroke(0, 0, 255)
      p5.beginShape()
      p5.strokeWeight(SIZE / 2)

      for (const node of path) {
        const { x, y } = node.coordinates(rows, columns)
        p5.vertex(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2)
      }

      p5.endShape()

      onFinish()

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

    ++index
  }

  const mouseClicked = ({ mouseX, mouseY, width, height }) => {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      const y = Math.floor(mouseY / SIZE)
      const x = Math.floor(mouseX / SIZE)

      onClick({ x, y })
    }
  }

  return <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />
}
