import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import './style.scss'

const MenuItem = ({ item, isActive, onClickHandler = () => {} }) => {
  return item.external ? (
    <a className='hover:text-red' href={item.link} target='_blank' rel='noreferrer'>
      {item.name}
    </a>
  ) : (
    <Link
      className={`${item.disabled ? 'link-disabled ' : 'hover:text-red'}${isActive ? ' text-red font-medium' : ''}`}
      to={item.link}
      onClick={() => onClickHandler()}
    >
      {item.name}
    </Link>
  )
}

const Menu = ({ item, idx }) => {
  const route = useLocation()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  return (
    <li key={`main-${idx}`} className='text-[15.3px] font-light leading-[28px] tracking-[0.22px]'>
      {item.dropdown ? (
        <div>
          <div
            className='flex items-center space-x-1 cursor-pointer py-2'
            onMouseEnter={() => {
              setIsDropdownVisible(true)
            }}
            onMouseLeave={() => {
              setIsDropdownVisible(false)
            }}
          >
            <span className={`hover:text-red${item.items.some((ele) => ele.link === route.pathname) ? ' text-red font-top' : ''}`}>{item.name}</span>
            <img
              alt='dropdown'
              src='/images/header/dropdown-arrow.svg'
              className={`${isDropdownVisible ? 'rotate-0' : 'rotate-180'} transition-all duration-150`}
            />
          </div>
          <div
            className='relative'
            onMouseEnter={() => {
              setIsDropdownVisible(true)
            }}
            onMouseLeave={() => {
              setIsDropdownVisible(false)
            }}
          >
            <div
              className={`flex flex-col py-3 px-[18.7px] min-w-[127.5px] w-max absolute border border-[#C81F39] bg-[#360E12] rounded-[3px] ${
                isDropdownVisible ? 'block' : 'hidden'
              }`}
            >
              {item.items.map((_item, j) => {
                return (
                  <MenuItem item={_item} isActive={route.pathname.includes(_item.link)} key={`more-${j}`} onClickHandler={() => setIsDropdownVisible(false)} />
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <MenuItem item={item} isActive={route.pathname === '/swap/onramp' ? item.link === '/swap/onramp' : route.pathname.includes(item.link)} />
      )}
    </li>
  )
}

export default Menu
