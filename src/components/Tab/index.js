import React from 'react'

const Tab = ({ className, tabData, activeTab, setActiveTab }) => (
  <div className={`${className} w-full font-figtree text-[12.75px] md:text-[12.75px] lg:text-[16.3px] tracking-[1.6px] flex `}>
    <div className='flex items-center w-full'>
      {tabData.map((item, idx) => {
        return (
          <button
            onClick={() => {
              setActiveTab(item)
            }}
            key={idx}
            className={`${activeTab === item ? 'border-red text-white font-medium' : 'border-black'} flex-1 uppercase border-b-[6.8px] pb-[10.2px]`}
          >
            {item}
          </button>
        )
      })}
    </div>
  </div>
)

export default Tab
