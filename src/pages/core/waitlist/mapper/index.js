import React from 'react'
import Card from '../card'

const Index = ({ data, setData, unFilteredArr }) => {
  return (
    <>
      {data.map((item, idx) => {
        return <Card unFilteredArr={unFilteredArr} setData={setData} className={`${idx !== data.length - 1 ? 'mb-6' : ''}`} data={item} key={idx} />
      })}
    </>
  )
}

export default Index
