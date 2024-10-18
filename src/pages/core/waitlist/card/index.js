import React, { useState } from 'react'
import { getChip } from 'utils'
import TransparentButton from 'components/Buttons/transparentButton'
import Modal from 'components/Modal'
import StyledButton from 'components/Buttons/styledButton'
import EditPool from '../modal'

const Index = ({ data, className, setData, unFilteredArr }) => {
  const handleIntrested = (id) => {
    let dup = [...unFilteredArr]
    const index = dup.findIndex((item) => item.id === id)
    dup[index].intresetedBol = !dup[index].intresetedBol
    setData(dup)
  }
  const [createPool, setCreatePool] = useState(false)
  const [deletePool, setDeletPool] = useState(false)

  const renderButton = () => {
    return (
      <div className='flex items-center space-x-2 py-3 px-5 text-[17px] leading-5 text-white font-figtree'>
        {!data.intresetedBol ? (
          <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} viewBox='0 0 16 16'>
            <path
              id='star'
              d='M3.581,16.492a.825.825,0,0,1-.5-.169.908.908,0,0,1-.331-.916l1.029-4.731L.291,7.481a.912.912,0,0,1-.249-.943.859.859,0,0,1,.731-.61l4.619-.438L7.218,1.031a.837.837,0,0,1,1.564,0l1.826,4.46,4.618.438a.858.858,0,0,1,.732.61.912.912,0,0,1-.249.943l-3.491,3.194,1.029,4.731a.907.907,0,0,1-.331.916.819.819,0,0,1-.935.042L8,13.881,4.017,16.366A.826.826,0,0,1,3.581,16.492ZM8,12.811a.826.826,0,0,1,.436.126l3.759,2.346-.971-4.466a.911.911,0,0,1,.269-.865l3.3-3.016-4.361-.413a.853.853,0,0,1-.707-.538L8,1.777,6.277,5.986a.851.851,0,0,1-.7.536l-4.361.413,3.3,3.016a.909.909,0,0,1,.269.865l-.971,4.466,3.759-2.345A.825.825,0,0,1,8,12.811ZM5.357,5.577h0Zm5.285,0h0Zm0,0'
              transform='translate(0 -0.492)'
              fill='#fff'
            />
          </svg>
        ) : (
          <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} viewBox='0 0 16 16'>
            <path
              id='filled-start'
              d='M3.581,16.492a.825.825,0,0,1-.5-.169.908.908,0,0,1-.331-.916l1.029-4.731L.291,7.481a.912.912,0,0,1-.249-.943.859.859,0,0,1,.731-.61l4.619-.438L7.218,1.031a.837.837,0,0,1,1.564,0l1.826,4.46,4.618.438a.858.858,0,0,1,.732.61.912.912,0,0,1-.249.943l-3.491,3.194,1.029,4.731a.907.907,0,0,1-.331.916.819.819,0,0,1-.935.042L8,13.881,4.017,16.366A.826.826,0,0,1,3.581,16.492ZM5.357,5.577h0Zm5.285,0h0Zm0,0'
              transform='translate(0 -0.492)'
              fill='#fff'
            />
          </svg>
        )}
        <span>Interested</span>
      </div>
    )
  }
  return (
    <>
      <div className={`px-5 py-[18px] bg-cardBg rounded-[5px] ${className}`}>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-white font-semibold font-figtree leading-[27px] text-[22px]'>{data.name}</p>
            <div className='flex items-center space-x-3 mt-1.5'>
              <div className={`${getChip(data.type)} bg-opacity-[0.08] px-2 py-1 text-[15px] leading-5 font-semibold`}>{data.type}</div>
              <div className='flex items-center space-x-1.5'>
                <img alt='' src='/images/core/participants.svg' />
                <span className='text-white leading-5'>{data.intreseted} Interested</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <TransparentButton
              onClickHandler={() => {
                handleIntrested(data.id)
              }}
              content={renderButton()}
            />
            <TransparentButton
              className='px-11 py-3'
              onClickHandler={() => {
                setCreatePool(true)
              }}
              content='Edit'
            />
            <TransparentButton
              className='p-2'
              onClickHandler={() => {
                setDeletPool(true)
              }}
              content={<img alt='' src='/images/core/trash.svg' />}
            />
          </div>
        </div>
        <p className='mt-3.5 mb-2.5  text-secondary leading-[22px]'>{data.des}</p>
        <div className='cursor-pointer flex items-center space-x-1.5'>
          <span className='text-green text-lg leading-5 font-medium'>Read More</span>
          <img alt='' src='/images/notifications/redirect.svg' />
        </div>
      </div>
      <Modal popup={deletePool} title='Delete Poll' setPopup={setDeletPool} width={459}>
        <p className='mt-2 leading-[22px] text-lightGray'>
          Are you sure you want to delete "<span className=' font-semibold'>{data.name}</span>"
        </p>
        <div className='flex items-center space-x-5 mt-5'>
          <TransparentButton
            onClickHandler={() => {
              setDeletPool(false)
            }}
            className='w-full'
            content='DELETE'
            isUpper
          />
          <StyledButton
            onClickHandler={() => {
              setDeletPool(false)
            }}
            className='w-full'
            content='CANCEL'
          />
        </div>
      </Modal>
      <EditPool data={data} edit createPool={createPool} setCreatePool={setCreatePool} />
    </>
  )
}

export default Index
