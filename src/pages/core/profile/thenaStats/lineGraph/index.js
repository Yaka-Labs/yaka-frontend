import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'

export const LineChart = ({ width, height, data, stroke, stats, className = '' }) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null)
  const boundsWidth = width
  const boundsHeight = height

  // Y axis
  const [min, max] = d3.extent(data, (d) => d.y)
  console.log(min, 's')
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0])
  }, [data, height])

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x)
  console.log(xMin, 's')

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth])
  }, [data, width])

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current)
    svgElement.selectAll('*').remove()
    const xAxisGenerator = d3.axisBottom(xScale)
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator)

    const yAxisGenerator = d3.axisLeft(yScale)
    svgElement.append('g').call(yAxisGenerator)
  }, [xScale, yScale, boundsHeight])

  // Build the line
  const lineBuilder = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
  const linePath = lineBuilder(data)
  if (!linePath) {
    return null
  }

  return (
    <div className={`${className}`}>
      <p style={{ color: stroke }} className='leading-5'>
        {stats}
      </p>
      <svg className='mt-5' width={width} height={height}>
        <g width={boundsWidth} height={boundsHeight}>
          <path d={linePath} opacity={1} stroke={stroke} fill='none' strokeWidth={1} />
        </g>
      </svg>
    </div>
  )
}
