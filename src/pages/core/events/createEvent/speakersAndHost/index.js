import React, { useMemo, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch } from 'react-redux'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import SearchInput from 'components/Input/SearchInput'
import Modal from 'components/Modal'
import LabelTooltip from 'components/TooltipLabelComponent'
import { addEventsData } from 'state/application/actions'

const Index = ({
  setEventName,
  speakersList,
  dropdown,
  setDropDown,
  speakersArr,
  setSpeakersArr,
  searchText,
  setSearchText,
  setAddSpeakerBol,
  addSpeakerBol,
  setAddSpeaker,
  addSpeaker,
  setSpeakersList,
  mainData,
  setCreateEvent,
}) => {
  const dispatch = useDispatch()
  const filterItems = (item) => {
    return speakersArr.some((_item) => _item.id === item.id)
  }
  const filteredData = useMemo(() => {
    const data = searchText ? speakersList.filter((item) => item.speakerName.toLowerCase().includes(searchText.toLowerCase())) : speakersList
    return data
  }, [speakersList, searchText])

  const onClickHandler = (ele) => {
    if (speakersArr.length > 0 && speakersArr.some((i) => i.id === ele.id)) {
      const filteredItem = speakersArr.filter((i) => i.id !== ele.id)
      setSpeakersArr(filteredItem)
    } else {
      setSpeakersArr([...speakersArr, ele])
    }
  }
  const addHost = (item, idx) => {
    let dup = [...speakersArr]
    dup[idx].host = !item.host
    setSpeakersArr(dup)
  }

  const [edit, setEdit] = useState(false)
  const updateSpeakersData = (speaker) => {
    const dup = [...speakersArr]
    const index = speakersArr.findIndex((item) => item.id === speaker.id)
    dup[index] = speaker
    setSpeakersArr(dup)
  }

  return (
    <>
      <div className='w-full relative mt-5'>
        <button
          onClick={() => {
            setAddSpeakerBol(true)
          }}
          className='flex items-center space-x-2 text-base leading-5 text-white font-medium relative bg-blue px-5 py-2 rounded-lg'
        >
          + Add Speaker
        </button>
        <OutsideClickHandler onOutsideClick={() => setDropDown(false)}>
          <div className=' flex flex-col items-center justify-center w-full mt-5'>
            <div className='flex items-center justify-between w-full'>
              <div className='text-base leading-5 text-lightGray'>Select Speakers (optional)</div>
              <button onClick={() => setSpeakersArr([])} className='text-green text-base leading-5'>
                Clear All
              </button>
            </div>
            <div className='w-full relative z-10 mt-2'>
              <div
                onClick={() => {
                  setDropDown(!dropdown)
                }}
                className='cursor-pointer flex items-center justify-between p-4 border-blue bg-body rounded-[3px] border'
              >
                <p className='text-lg leading-5 text-white'>
                  {speakersArr.length > 0 && speakersArr.length} Select{speakersArr.length > 0 && 'ed'}{' '}
                </p>
                <img
                  alt=''
                  className={`${dropdown ? 'rotate-180' : ''} transform transition-all duration-150 ease-in-out`}
                  src='/images/swap/dropdown-arrow.png'
                />
              </div>
              <div
                className={`${
                  dropdown ? 'block' : 'hidden'
                }    bg-body max-h-[200px] min-h-[200px] w-full px-3 z-20 border-blue border-x border-b overflow-auto py-3 h-full `}
              >
                <SearchInput placeholder='Search' searchText={searchText} setSearchText={setSearchText} full />
                <div className='grid grid-cols-3 2xl:grid-cols-4 gap-2 mt-5'>
                  {/* <div
              onClick={() => {
                speakersArr.length > 0 ? setSpeakersArr([]) : setSpeakersArr(filteredData)
              }}
              className={`bg-[#160F42] text-white py-2 px-2.5 cursor-pointer rounded-xl flex items-center justify-center`}
            >
              {speakersArr.length > 0 ? 'Unselect all' : 'Select all'}
            </div> */}
                  {filteredData.map((item, idx) => {
                    return (
                      <div
                        onClick={() => {
                          onClickHandler(item)
                        }}
                        className={`py-2 px-2.5 ${filterItems(item) ? 'bg-blue' : 'bg-[#160F42]'} cursor-pointer rounded-xl flex items-start space-x-1.5`}
                        key={idx}
                      >
                        <img alt='' src={item.img} className='w-6 h-6 rounded-full' />
                        <div>
                          <p className='text-sm text-white font-figtree font-medium leading-5'>{item.speakerName}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {speakersArr &&
              speakersArr.map((item, idx) => {
                return (
                  <div key={idx} className='flex items-center space-x-4 w-full mt-3'>
                    <div className='flex items-center justify-between py-3 px-4 border border-[#44476A] rounded-[7px] w-full'>
                      <div className='flex items-center space-x-2'>
                        <img src={item.img} alt='' className='w-[30px] h-[30px] rounded-full' />
                        <span className='text-base leading-5 font-medium text-white font-figtree'>{item.speakerName}</span>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <button
                          onClick={() => {
                            setAddSpeakerBol(true)
                            setEdit(true)
                            setAddSpeaker(item)
                          }}
                        >
                          <img alt='edit icon' src='/images/core/edit.svg' />
                        </button>
                        <button onClick={() => setSpeakersArr(speakersArr.filter((_item) => _item.id !== item.id))}>
                          <img alt='close button icon' src='/images/common/close-button.svg' />
                        </button>
                      </div>
                    </div>
                    <div className='flex items-center space-x-1.5 '>
                      <div
                        onClick={() => addHost(item, idx)}
                        className='w-[22px] h-[22px] cursor-pointer rounded-full bg-body border-blue border flex items-center justify-center flex-col'
                      >
                        {item.host && <div className='w-3 h-3 bg-blue rounded-full' />}
                      </div>
                      <span className='text-[17px] text-lightGray font-figtree'>Host</span>
                    </div>
                  </div>
                )
              })}
            <div className='flex items-center space-x-5 mt-6'>
              <TransparentButton content='BACK' onClickHandler={() => setEventName('TIME AND LOCATION')} className='px-16 py-3 text-[17px]' />
              <StyledButton
                onClickHandler={() => {
                  dispatch(addEventsData(mainData))
                  setCreateEvent(false)
                }}
                disabled={!speakersArr.length > 0}
                content='PREVIEW'
                className='py-3 px-16'
                isUpper
              />
            </div>
          </div>
        </OutsideClickHandler>
      </div>

      {/* edit and add speaker modal */}
      <Modal popup={addSpeakerBol} setPopup={setAddSpeakerBol} title={edit ? 'Edit Speaker' : 'Add Speaker'} width={459}>
        <>
          <div className='flex items-center space-x-3 mt-5 '>
            <img alt='' className='w-[60px] h-[60px] rounded-full' src={`${addSpeaker.img ? addSpeaker.img : '/images/core/speaker-profile.png'}`} />
            <button className='text-green font-medium leading-5 relative overflow-hidden'>
              + Upload Image
              <input
                onChange={(e) => {
                  setAddSpeaker({ ...addSpeaker, img: URL.createObjectURL(e.target.files[0]) })
                }}
                accept='image/JPEG, image/PNG, image/SVG , image/GIF'
                type='file'
                className='absolute inset-0 w-full h-full z-20 opacity-0'
              />
            </button>
            {addSpeaker.img && (
              <button
                onClick={() => {
                  setAddSpeaker({ ...addSpeaker, img: null })
                }}
                className='text-error font-medium leading-5'
              >
                Remove
              </button>
            )}
          </div>
          <div className='w-full mt-5'>
            <LabelTooltip label='Speaker Name' />
            <SearchInput
              max={32}
              searchText={addSpeaker.speakerName}
              setSearchText={(e) => {
                setAddSpeaker({ ...addSpeaker, speakerName: e })
              }}
              disableSearchIcon
              full
              className='mt-2'
            />
          </div>
          <div className='w-full mt-5'>
            <LabelTooltip label='X Profile Link (optional)' />
            <SearchInput
              max={32}
              searchText={addSpeaker.twitterProfileLink}
              setSearchText={(e) => {
                setAddSpeaker({ ...addSpeaker, twitterProfileLink: e })
              }}
              disableSearchIcon
              full
              className='mt-2'
            />
          </div>
          <div className='flex items-center justify-center space-x-5 mt-6'>
            <TransparentButton content='CANCEL' onClickHandler={() => setAddSpeakerBol(false)} className='px-16 py-3' />
            <StyledButton
              onClickHandler={() => {
                edit ? updateSpeakersData(addSpeaker) : setSpeakersList([...speakersList, { ...addSpeaker, id: uuidv4() }])
                setAddSpeakerBol(false)
              }}
              disabled={!addSpeaker.img || !addSpeaker.speakerName}
              content={edit ? 'SAVE' : 'ADD'}
              className='py-3 px-16'
              isUpper
            />
          </div>
        </>
      </Modal>
    </>
  )
}

export default Index
