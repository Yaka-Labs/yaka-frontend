import React from 'react'

const Index = ({ tabs, setTab, tab, home }) => {
  return (
    <ul className={`flex items-center font-figtree ${home ? 'justify-around w-full' : 'space-x-4 xl:space-x-[30px]'}`}>
      {tabs.map((item, idx) => {
        return (
          <li
            key={idx}
            onClick={() => {
              setTab(item)
            }}
            className={`cursor-pointer pb-1.5 ${home ? 'text-xl' : 'text-xl xl:text-[27px]'} ${item === tab ? 'text-white font-medium' : 'text-[#757384]'}`}
          >
            {item}
          </li>
        )
      })}
    </ul>
  )
}

export default Index
