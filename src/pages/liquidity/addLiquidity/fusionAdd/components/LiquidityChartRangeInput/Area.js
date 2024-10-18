import React, { useMemo } from 'react'
import { area, curveStepAfter } from 'd3'
import inRange from 'lodash/inRange'
import { Path } from './styled'

export const Area = ({ series, xScale, yScale, xValue, yValue, fill }) =>
  useMemo(
    () => (
      <Path
        fill={fill}
        d={
          area()
            .curve(curveStepAfter)
            .x((d) => xScale(xValue(d)))
            .y1((d) => yScale(yValue(d)))
            .y0(yScale(0))(series.filter((d) => inRange(xScale(xValue(d)), 0, innerWidth))) ?? undefined
        }
      />
    ),
    [fill, series, xScale, xValue, yScale, yValue],
  )
