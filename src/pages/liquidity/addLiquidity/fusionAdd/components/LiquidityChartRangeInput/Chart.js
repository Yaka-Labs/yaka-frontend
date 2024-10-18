import React, { useEffect, useMemo, useRef, useState } from 'react'
import { max, scaleLinear, select } from 'd3'
import { Area } from './Area'
import { AxisBottom } from './AxisBottom'
import { Brush } from './Brush'
import { Line } from './Line'
import Zoom from './Zoom'

export const xAccessor = (d) => d.price0
export const yAccessor = (d) => d.activeLiquidity

export const Chart = ({
  id = 'liquidityChartRangeInput',
  data: { series, current },
  styles,
  dimensions: { width, height },
  margins,
  interactive = true,
  brushDomain,
  brushLabels,
  onBrushDomainChange,
  zoomLevels,
}) => {
  const zoomRef = useRef(null)

  const [zoom, setZoom] = useState(null)

  const [innerHeight, innerWidth] = useMemo(() => [height - margins.top - margins.bottom, width - margins.left - margins.right], [width, height, margins])

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      xScale: scaleLinear()
        .domain([current * zoomLevels.initialMin, current * zoomLevels.initialMax])
        .range([0, innerWidth]),
      yScale: scaleLinear()
        .domain([0, max(series, yAccessor)])
        .range([innerHeight, 0]),
    }

    if (zoom) {
      const newXscale = zoom.rescaleX(scales.xScale)
      scales.xScale.domain(newXscale.domain())
    }

    return scales
  }, [current, zoomLevels.initialMin, zoomLevels.initialMax, innerWidth, series, innerHeight, zoom])

  useEffect(() => {
    // reset zoom as necessary
    setZoom(null)
  }, [zoomLevels])

  useEffect(() => {
    if (!brushDomain && current) {
      // L-1
      // const initialLowPrice = current * 0.75;
      // const initialHighPrice = current * 1.5;
      // onBrushDomainChange([initialLowPrice, initialHighPrice], undefined);
    }
  }, [brushDomain, current, onBrushDomainChange, xScale])

  useEffect(() => {
    select('.tick:first-child').attr('transform', 'translate(10,0)')
  }, [])

  return (
    <>
      <Zoom
        svg={zoomRef.current}
        xScale={xScale}
        setZoom={setZoom}
        width={innerWidth}
        height={
          // allow zooming inside the x-axis
          height
        }
        zoomLevels={zoomLevels}
      />
      <svg width='100%' height='100%' viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x='0' y='0' width={innerWidth} height={height} />
          </clipPath>

          <linearGradient id='liquidity-chart-gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='rgba(39, 0, 255, 0.2)' />
            <stop offset='100%' stopColor='rgba(39, 151, 255, 0)' />
          </linearGradient>
          {brushDomain && (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect fill='white' x={xScale(brushDomain[0])} y='0' width={xScale(brushDomain[1]) - xScale(brushDomain[0])} height={innerHeight} />
            </mask>
          )}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area series={series} xScale={xScale} yScale={yScale} xValue={xAccessor} yValue={yAccessor} />

            {brushDomain && (
              // duplicate area chart with mask for selected area
              <g mask={`url(#${id}-chart-area-mask)`}>
                <Area series={series} xScale={xScale} yScale={yScale} xValue={xAccessor} yValue={yAccessor} fill={styles.area.selection} />
              </g>
            )}

            <Line value={current} xScale={xScale} innerHeight={innerHeight} />

            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
          </g>

          <Brush
            id={id}
            xScale={xScale}
            interactive={interactive}
            brushLabelValue={brushLabels}
            brushExtent={brushDomain ?? xScale.domain()}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            setBrushExtent={onBrushDomainChange}
          />
        </g>
      </svg>
    </>
  )
}
