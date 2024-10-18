import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CommonHollowModal from 'components/CommonHollowModal'
import Tab from 'components/Tab'
import ManageTab from './manage'
import MergeTab from './merge'
import SplitTab from './split'
import TransferTab from './transfer'

const Tabs = ['MANAGE', 'MERGE', 'SPLIT', 'TRANSFER']

const ManageModal = ({ isOpen, setIsOpen, selected, theAsset }) => {
  const [activeTab, setActiveTab] = useState(Tabs[0])
  const { final } = useSelector((state) => state.transactions)

  useEffect(() => {
    if (['Split Successful', 'Merge Successful', 'Transfer Successful'].includes(final)) {
      setIsOpen(false)
    }
  }, [final])

  return (
    <CommonHollowModal popup={isOpen} width={499.8} setPopup={setIsOpen} title={`Manage veYAKA #${selected.id}`}>
      <Tab className='mt-[13.6px] md:mt-[24.65px]' activeTab={activeTab} setActiveTab={setActiveTab} tabData={Tabs} />
      {activeTab === Tabs[0] && <ManageTab selected={selected} theAsset={theAsset} />}
      {activeTab === Tabs[1] && <MergeTab selected={selected} />}
      {activeTab === Tabs[2] && <SplitTab selected={selected} />}
      {activeTab === Tabs[3] && <TransferTab selected={selected} />}
    </CommonHollowModal>
  )
}

export default ManageModal
