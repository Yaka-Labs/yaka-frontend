import React, { useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { CompsContext } from 'context/CompsContext'
import Details from './Details'

const CompetitionDetail = () => {
  const param = useParams()
  const compList = useContext(CompsContext)

  const detail = useMemo(() => {
    return compList.find((ele) => ele.id === param.id)
  }, [param.id, compList])

  if (!detail) return

  return (
    <div className='w-full  2xl:max-w-full'>
      <Details data={detail} />
    </div>
  )
}

export default CompetitionDetail
