import styled from 'styled-components/macro'

// index
export const ChartWrapper = styled.div`
  position: relative;
  justify-content: center;
  align-content: center;
`

// Area
export const Path = styled.path`
  opacity: 1;
  stroke: ${({ fill }) => (fill ? '#0000FF' : '#000076')};
  stroke-width: 2px;
  fill: ${({ fill }) => (fill ? 'rgba(0, 0, 255, 0.05)' : 'transparent')};
`

// AxisBottom
export const StyledGroup = styled.g`
  line {
    display: none;
    fill: white;
  }

  text {
    color: white;
    transform: translateY(5px);
  }
`

// Brush
export const LabelGroup = styled.g`
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  transition: opacity 300ms;
`
export const TooltipBackground = styled.rect`
  fill: ${() => '#0000FF'};
`
export const Tooltip = styled.text`
  text-anchor: middle;
  font-size: 9px;
  font-family: Montserrat, sans-serif;
  fill: white;
`

// Line
export const StyledLine = styled.line`
  opacity: 0.5;
  stroke-width: 1;
  stroke: white;
  stroke-dasharray: 3;
  fill: none;
`

// Zoom
export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ count }) => count.toString()}, 1fr);
  grid-gap: 6px;
  position: absolute;
  border-radius: 4px;
  top: 0;
  right: 0;
`

export const ZoomOverlay = styled.rect`
  fill: transparent;
`
