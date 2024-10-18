import React, { useEffect, useMemo, useRef } from 'react'
import { select, zoom } from 'd3'

const Zoom = ({ svg, xScale, setZoom, width, height, zoomLevels }) => {
  const zoomBehavior = useRef()

  const [initial] = useMemo(() => [() => svg && zoomBehavior.current && select(svg).transition().call(zoomBehavior.current.scaleTo, 0.5)], [svg, zoomBehavior])

  useEffect(() => {
    if (!svg) return

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', ({ transform }) => setZoom(transform))

    select(svg).call(zoomBehavior.current)
  }, [height, width, setZoom, svg, xScale, zoomBehavior, zoomLevels, zoomLevels.max, zoomLevels.min])

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    initial()
  }, [initial, zoomLevels])

  return <div />
}

export default Zoom
