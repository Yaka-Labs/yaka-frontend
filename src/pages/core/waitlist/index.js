import React, { useMemo, useState } from 'react'
import TabFilter from 'components/TabFilter'
import TransparentButton from 'components/Buttons/transparentButton'
import Model from './modal'
import Mapper from './mapper'

const WaitList = () => {
  const Tabs = ['ACTIVE', 'APPROVED', 'ARCHIVED', 'INTERESTED']
  const [activeTab, setActiveTab] = useState('ACTIVE')
  const [pool, setPool] = useState([
    {
      id: 1,
      name: 'Core Multiplayer Game',
      type: 'ARCHIVED',
      intreseted: '1,356',
      des: 'test dexcription 1',
      intresetedBol: false,
    },
    {
      id: 2,
      name: 'Lorem ipsum dolor sit amet',
      type: 'APPROVED',
      intreseted: '862',
      des: 'test dexcription 2',
      intresetedBol: true,
    },
    {
      id: 3,
      name: 'Lorem ipsum dolor sit amet',
      type: 'APPROVED',
      intreseted: '862',
      des: 'test dexcription 3',
      intresetedBol: false,
    },
    {
      id: 4,
      name: 'Consectetur adipiscing elit',
      type: 'ACTIVE',
      intreseted: '2512',
      des: 'test dexcription 1',
      intresetedBol: true,
    },
    {
      id: 5,
      name: 'Core Multiplayer Game',
      type: 'ARCHIVED',
      intreseted: '1,356',
      des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet,ectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh quis que suscierdum rutrum a in tortor. Pellentesque suscipit nibh quis dum rutrum a in tortosque suscipit nibh quis que suscie…',
      intresetedBol: false,
    },
    {
      id: 6,
      name: 'Lorem ipsum dolor sit amet',
      type: 'APPROVED',
      intreseted: '862',
      des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet,ectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh quis que suscierdum rutrum a in tortor. Pellentesque suscipit nibh quis dum rutrum a in tortosque suscipit nibh quis que suscie…',
      intresetedBol: true,
    },
    {
      id: 7,
      name: 'Core Multiplayer Game',
      type: 'ARCHIVED',
      intreseted: '1,356',
      des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet,ectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh quis que suscierdum rutrum a in tortor. Pellentesque suscipit nibh quis dum rutrum a in tortosque suscipit nibh quis que suscie…',
      intresetedBol: false,
    },
    {
      id: 8,
      name: 'Lorem ipsum dolor sit amet',
      type: 'APPROVED',
      intreseted: '862',
      des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet,ectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh quis que suscierdum rutrum a in tortor. Pellentesque suscipit nibh quis dum rutrum a in tortosque suscipit nibh quis que suscie…',
      intresetedBol: false,
    },
    {
      id: 9,
      name: 'Lorem ipsum dolor sit amet',
      type: 'ACTIVE',
      intreseted: '862',
      des: 'test dexcription 2',
      intresetedBol: false,
    },
    {
      id: 10,
      name: 'Lorem ipsum dolor sit amet',
      type: 'ACTIVE',
      intreseted: '862',
      des: 'test dexcription 3',
      intresetedBol: false,
    },
  ])

  const [createPool, setCreatePool] = useState(false)

  const filteredData = useMemo(() => {
    let data = []
    if (activeTab === 'INTERESTED') {
      data = pool.filter((item) => item.intresetedBol)
    } else {
      data = pool.filter((item) => item.type === activeTab)
    }
    return data
  }, [activeTab])
  const renderContent = () => {
    return (
      <div className='px-[30px] flex items-center justify-center flex-col text-[17px]  h-[52px] relative z-10 text-white'>
        <span>+ CREATE POLL</span>
      </div>
    )
  }

  return (
    <div className='w-full 2xl:max-w-full'>
      <p className='text-4xl leading-10 font-figtree font-semibold text-white mb-2.5'>Waitlist</p>
      <div className='flex items-center justify-between'>
        <TabFilter className='mb-5' data={Tabs} filter={activeTab} setFilter={setActiveTab} />
        <TransparentButton
          onClickHandler={() => {
            setCreatePool(true)
          }}
          content={renderContent()}
          isUpper
        />
      </div>
      <Mapper unFilteredArr={pool} setData={setPool} data={filteredData} />
      <Model createPool={createPool} setCreatePool={setCreatePool} />
    </div>
  )
}

export default WaitList
