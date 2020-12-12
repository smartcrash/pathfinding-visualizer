import React from 'react'
import Sketch from 'react-p5'
import { PIXEL_SIZE } from '../constants'

let index = 0
let oldCurrent = null

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
    p5.frameRate(35)
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
        end.x * PIXEL_SIZE + PIXEL_SIZE / 2,
        end.y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )

      p5.fill('red')
      p5.ellipse(
        start.x * PIXEL_SIZE + PIXEL_SIZE / 2,
        start.y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )

      for (const { x, y } of walls) {
        p5.fill(0)
        p5.rect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE)
      }

      return
    }

    if (index === states.length) {
      oldCurrent = null

      p5.noFill()
      p5.stroke(0, 0, 255)
      p5.beginShape()

      p5.strokeWeight(PIXEL_SIZE / 2)

      for (const { x, y } of path) {
        p5.vertex(
          x * PIXEL_SIZE + PIXEL_SIZE / 2,
          y * PIXEL_SIZE + PIXEL_SIZE / 2
        )
      }

      p5.endShape()

      onFinish()

      return
    }

    const { current, neighbors } = states[index]

    for (const { x, y } of neighbors) {
      p5.line(
        current.x * PIXEL_SIZE + PIXEL_SIZE / 2,
        current.y * PIXEL_SIZE + PIXEL_SIZE / 2,
        x * PIXEL_SIZE + PIXEL_SIZE / 2,
        y * PIXEL_SIZE + PIXEL_SIZE / 2
      )
    }

    for (const { x, y } of [current, ...neighbors]) {
      p5.fill('white')
      p5.ellipse(
        x * PIXEL_SIZE + PIXEL_SIZE / 2,
        y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )
    }

    p5.fill('yellow')
    p5.ellipse(
      current.x * PIXEL_SIZE + PIXEL_SIZE / 2,
      current.y * PIXEL_SIZE + PIXEL_SIZE / 2,
      PIXEL_SIZE / 2
    )

    if (oldCurrent) {
      p5.fill('red')
      p5.ellipse(
        oldCurrent.x * PIXEL_SIZE + PIXEL_SIZE / 2,
        oldCurrent.y * PIXEL_SIZE + PIXEL_SIZE / 2,
        PIXEL_SIZE / 2
      )
    }

    oldCurrent = current

    ++index
  }

  return <Sketch setup={setup} draw={draw} {...listeners} />
}
