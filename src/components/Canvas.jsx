import React from 'react'
import Sketch from 'react-p5'
import { PIXEL_SIZE, FRAME_RATE } from '../constants'

let index = 0

export function Canvas({
  paused,
  rows,
  columns,
  start,
  end,
  walls,
  states,
  path,
  listeners = {},
  onFinish = () => null,
}) {
  const setup = (p5, ref) => {
    p5.createCanvas(rows * PIXEL_SIZE, columns * PIXEL_SIZE).parent(ref)
    p5.background(255)
    p5.frameRate(FRAME_RATE)
  }

  const draw = p5 => {
    p5.stroke(180)
    p5.strokeWeight(1)

    if (paused) {
      index = 0

      p5.stroke(180)
      p5.fill(255)
      p5.rect(0, 0, p5.width, p5.height, PIXEL_SIZE / 2)

      p5.fill(0, 255, 0)
      p5.ellipse(
        end.coordinates(rows, columns).x * PIXEL_SIZE + PIXEL_SIZE / 2,
        end.coordinates(rows, columns).y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )

      p5.fill('red')
      p5.ellipse(
        start.coordinates(rows, columns).x * PIXEL_SIZE + PIXEL_SIZE / 2,
        start.coordinates(rows, columns).y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )

      for (const node of walls) {
        const { x, y } = node.coordinates(rows, columns)
        p5.fill(0)
        p5.rect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE)
      }

      return
    }

    if (index === states.length) {
      p5.noFill()
      p5.stroke(0, 0, 255)
      p5.beginShape()
      p5.strokeWeight(PIXEL_SIZE / 2)

      for (const node of path) {
        const { x, y } = node.coordinates(rows, columns)
        p5.vertex(
          x * PIXEL_SIZE + PIXEL_SIZE / 2,
          y * PIXEL_SIZE + PIXEL_SIZE / 2
        )
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
        visited.x * PIXEL_SIZE + PIXEL_SIZE / 2,
        visited.y * PIXEL_SIZE + PIXEL_SIZE / 2,
        x * PIXEL_SIZE + PIXEL_SIZE / 2,
        y * PIXEL_SIZE + PIXEL_SIZE / 2
      )
    }

    for (const { x, y } of [visited, ...neighbors]) {
      p5.fill('white')
      p5.ellipse(
        x * PIXEL_SIZE + PIXEL_SIZE / 2,
        y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )
    }

    p5.fill('red')
    p5.ellipse(
      visited.x * PIXEL_SIZE + PIXEL_SIZE / 2,
      visited.y * PIXEL_SIZE + PIXEL_SIZE / 2,
      PIXEL_SIZE / 2
    )

    ++index
  }

  return <Sketch setup={setup} draw={draw} {...listeners} />
}
