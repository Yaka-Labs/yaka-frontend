import React from 'react'
import dayjs from 'dayjs'
import Chart from 'react-apexcharts'
import { BigNumber } from '@ethersproject/bignumber'
import './style.scss'
import { formatUnits } from 'ethers/lib/utils'

const formatDateFromTimeStamp = (timestamp, format, addedDay = 0) => {
  return dayjs.unix(timestamp).add(addedDay, 'day').utc().format(format)
}

const formatCompact = (unformatted, decimals = 18, maximumFractionDigits = 3, maxPrecision = 4) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits,
  })

  if (!unformatted) return '0'

  if (unformatted === Infinity) return '∞'

  let formatted = Number(unformatted)

  if (unformatted instanceof BigNumber) {
    formatted = Number(formatUnits(unformatted.toString(), decimals))
  }

  return formatter.format(Number(formatted.toPrecision(maxPrecision)))
}

const formatNumber = (unformatted, showDigits = 2) => {
  // get fraction digits for small number
  if (!unformatted) return 0
  const absNumber = Math.abs(Number(unformatted))
  if (absNumber > 0) {
    const digits = Math.ceil(Math.log10(1 / absNumber))
    if (digits < 3) {
      return Number(unformatted).toLocaleString('us')
    } else {
      return Number(unformatted).toFixed(digits + showDigits)
    }
  } else {
    return 0
  }
}

const AreaChart = ({ strokeColor = '#ED00C9', categories = [], data = [], dates = [], yAxisValues, height = 200, yAxisTicker = '$', isMinZero = false }) => {
  const yMax = yAxisValues ? Math.max(...yAxisValues.map((val) => Number(val))) : 0
  const yMin = !isMinZero && yAxisValues ? Math.min(...yAxisValues.map((val) => Number(val))) : 0

  const options = {
    chart: {
      sparkline: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      width: '100%',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      colors: [strokeColor],
      curve: 'smooth',
    },
    markers: {
      colors: [strokeColor],
      strokeWidth: 0,
    },
    fill: {
      type: 'gradient',
      colors: ['#ED00C957', '#BD00ED0F'],
      gradient: {
        gradientToColors: ['#ED00C957', '#BD00ED0F'],
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 0.15,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: data.map(() => ''),
      axisBorder: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: new Array(categories.length).fill('#CACED3'),
        },
      },
    },
    yaxis: {
      show: false,
      min: yAxisValues ? yMin : undefined,
      max: yAxisValues ? yMax : undefined,
      tickAmount: yAxisValues?.length,
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      fillSeriesColor: false,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        return `<div class="area-tooltip"><div class="tooltip-text">${formatDateFromTimeStamp(
          dates[dataPointIndex],
          'MMM DD, YYYY',
        )}</div><div class="tooltip-text"><b>
        ${yAxisTicker === '$' ? yAxisTicker : ''}${formatCompact(series[seriesIndex][dataPointIndex])}${yAxisTicker === '%' ? yAxisTicker : ''}
      </b></div></div>`
      },
    },
  }

  const series = [
    {
      name: 'Prices',
      data,
    },
  ]

  return (
    <div className='flex mt-2.5 w-full'>
      <div className='chart-container'>
        <Chart options={options} series={series} type='area' width='100%' height={height} />
        <div className='category-values'>
          {categories.map((val, ind) => (
            <p key={ind}>{val}</p>
          ))}
        </div>
      </div>
      {yAxisValues && (
        <div className='yaxis'>
          {yAxisValues.map((value, index) => (
            <p key={index}>
              {
                // this is to show small numbers less than 0.0001

                `${yAxisTicker === '$' ? yAxisTicker : ''}${value > 0.0001 ? formatCompact(value) : formatNumber(value)}${
                  yAxisTicker === '%' ? yAxisTicker : ''
                }`
              }
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default AreaChart
