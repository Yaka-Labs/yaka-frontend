import React, { useMemo } from 'react'
import { axisBottom, select } from 'd3'
import { StyledGroup } from './styled'

const Axis = ({ axisGenerator }) => {
  const axisRef = (axis) => {
    if (axis) {
      select(axis).call(axisGenerator)
    }
  }

  return <g ref={axisRef} />
}

export const AxisBottom = ({ xScale, innerHeight, offset = 0 }) => {
  return useMemo(
    () => (
      <StyledGroup transform={`translate(0, ${innerHeight + offset})`}>
        <Axis axisGenerator={axisBottom(xScale).ticks(6).tickSizeOuter(0)} />
      </StyledGroup>
    ),
    [innerHeight, offset, xScale],
  )
}
