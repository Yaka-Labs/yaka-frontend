import React, { useState } from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import OutsideClickHandler from 'react-outside-click-handler'
import { NUMBER_OF_NOWS } from 'config/constants'

const MyPaginate = styled(ReactPaginate).attrs({
  // You can redefine classes here, if you want.
  activeClassName: 'active', // default to "selected"
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  color: #fff;
  font-size: 14.45px;
  li a {
    padding: 4.25px 9.35px;
    cursor: pointer;
    width: 25.5px;
    height: 25.5px;
  }
  li.active a {
    background: #0000af;
    border-radius: 2.55px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`

const Pagination = ({ pageSize, setPageSize, handlePageClick, pageCount, currentPage, total = 0 }) => {
  const [rowDropDown, setRowDropDown] = useState(false)
  return (
    <div className='flex flex-col-reverse items-center lg:flex-row w-full justify-end mt-[12.75px]'>
      <div className='flex space-x-[17px] lg:space-x-[6.8px] mt-[10.2px] lg:mt-0'>
        <div className='flex items-center space-x-[8.5px] text-[14.45px] text-white'>
          <p>Show: </p>
          <div className='relative z-20'>
            <div
              onClick={() => {
                setRowDropDown(!rowDropDown)
              }}
              className='flex items-center space-x-[3.4px] cursor-pointer'
            >
              <p>{pageSize} Rows</p>
              <img
                className={`${rowDropDown ? 'rotate-180' : ''} transform transition-all duration-300 ease-in-out`}
                alt=''
                src='/images/common/triangle.svg'
              />
            </div>
            {rowDropDown && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setRowDropDown(false)
                }}
              >
                <div className='bg-[#000045] overflow-auto text-white border-[#0000AF] border text-xs md:text-[13.6px] leading-[20.4px] rounded-md pl-[10.2px] py-[8.5px] pr-[20.4px] absolute top-8'>
                  {NUMBER_OF_NOWS.map((item, idx) => {
                    return (
                      <div
                        onClick={() => {
                          setPageSize(item)
                          setRowDropDown(false)
                        }}
                        className='flex items-center space-x-[3.4px] cursor-pointer'
                        key={idx + 'pagination'}
                      >
                        <span>{item}</span> <p>Rows</p>
                      </div>
                    )
                  })}
                </div>
              </OutsideClickHandler>
            )}
          </div>
        </div>
        <div className='flex items-center space-x-[8.5px] text-[14.45px] text-white'>
          {`${currentPage * pageSize + 1}-${Math.min(currentPage * pageSize + pageSize, total)} of ${total}`}
        </div>
      </div>
      <MyPaginate
        breakLabel='...'
        nextLabel='>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={pageCount}
        previousLabel='<'
        renderOnZeroPageCount={null}
        forcePage={currentPage}
      />
    </div>
  )
}

export default Pagination
