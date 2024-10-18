import React, { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Modal from 'components/Modal'
import Details from './details'
import TimeAndLocation from './timeAndLocation'
import Speakers from './speakersAndHost'

const Index = ({ createEventComponent, setCreateEventComponent, setCreateEvent, createEvent }) => {
  const eventComponents = ['DETAILS', 'TIME AND LOCATION', 'SPEAKERS & HOST']

  // details component states
  const [image, setImage] = useState('')
  const [eventName, setEventName] = useState()
  const [value, setValue] = useState('')
  const [type, setType] = useState('Audio')
  const [eventDescription, setEventDescription] = useState('')

  // time and location
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    eventLocation: '',
    eventLocationName: '',
  })

  const suggestions = [
    {
      name: 'Thena Discord',
      link: 'https://discord.gg/yaka-finance',
    },
    {
      name: 'Thena X Spaces',
      link: 'https://twitter.com/home?lang=en',
    },
    {
      name: 'Thena Telegram',
      link: 'https://telegram.org/',
    },
  ]

  // Speakers
  const [searchText, setSearchText] = useState()
  const [speakersList, setSpeakersList] = useState([
    {
      id: 1,
      speakerName: 'Ouroboros Capital',
      host: false,
      img: '/images/profile/1.png',
    },
    {
      id: 2,
      speakerName: 'Xermes',
      host: false,
      img: '/images/profile/2.png',
    },
    {
      id: 3,
      speakerName: 'Theseus',
      host: false,
      img: '/images/profile/2.png',
    },
    {
      id: 4,
      speakerName: 'John Doe',
      host: false,
      img: '/images/profile/1.png',
    },
  ])
  const [dropdown, setDropDown] = useState(false)
  const [speakersArr, setSpeakersArr] = useState([])

  const [addSpeakerBol, setAddSpeakerBol] = useState(false)
  const [addSpeaker, setAddSpeaker] = useState({
    id: null,
    img: '',
    speakerName: null,
    twitterProfileLink: '',
    host: false,
  })

  const checkIfTabIsEnabled = (tab) => {
    switch (tab) {
      case 'DETAILS':
        return true
      case 'TIME AND LOCATION': {
        return eventName && image && value && eventDescription
      }
      case 'SPEAKERS & HOST':
        return formData.startDate && formData.startTime && formData.eventLocation

      default:
        return false
    }
  }

  const mainData = useMemo(() => {
    let dup = {
      img: image && URL.createObjectURL(image),
      time: formData.startTime,
      id: uuidv4(),
      name: eventName,
      event: 'LIVE',
      eventType: type,
      people: '946',
      total: '',
      timeRemaining: '1h 20m',
      locationLink: formData.eventLocation,
      location: formData.eventLocation,
      eventDescription,
    }
    return dup
  }, [formData, eventName, image, value, eventDescription, type])

  const renderComponent = () => {
    switch (createEventComponent) {
      case 'DETAILS':
        return (
          <Details
            eventName={eventName}
            setEventName={setEventName}
            setImage={setImage}
            image={image}
            setValue={setValue}
            value={value}
            setType={setType}
            type={type}
            eventDescription={eventDescription}
            setEventDescription={setEventDescription}
            setCreateEventComponent={setCreateEventComponent}
          />
        )
      case 'TIME AND LOCATION':
        return (
          <TimeAndLocation
            eventnName={createEventComponent}
            setEventName={setCreateEventComponent}
            setFormData={setFormData}
            formData={formData}
            suggestions={suggestions}
            checkIfTabIsEnabled={checkIfTabIsEnabled}
          />
        )
      case 'SPEAKERS & HOST':
        return (
          <Speakers
            speakersList={speakersList}
            setSpeakersList={setSpeakersList}
            dropdown={dropdown}
            setDropDown={setDropDown}
            speakersArr={speakersArr}
            setSpeakersArr={setSpeakersArr}
            searchText={searchText}
            setSearchText={setSearchText}
            setAddSpeakerBol={setAddSpeakerBol}
            addSpeakerBol={addSpeakerBol}
            setAddSpeaker={setAddSpeaker}
            addSpeaker={addSpeaker}
            setEventName={setCreateEventComponent}
            mainData={mainData}
            setCreateEvent={setCreateEvent}
          />
        )
      default:
    }
  }

  return (
    <Modal popup={createEvent} setPopup={setCreateEvent} title='Create Event' width={595}>
      <div className='mt-[22px] flex items-center justify-center flex-col'>
        <p className='text-xl font-figtree leading-6 text-white font-semibold tracking-[2px]'>{createEventComponent}</p>
        <div className='flex items-center space-x-[17px] mt-2.5'>
          {eventComponents.map((item, idx) => {
            const enabled = checkIfTabIsEnabled(item)
            const previousTabsHaveEmptyFields = eventComponents.slice(0, idx).some((tabItem) => !checkIfTabIsEnabled(tabItem))
            return (
              <button
                onClick={() => {
                  setCreateEventComponent(item)
                }}
                className={`w-10 h-10 flex flex-col items-center justify-center rounded-[3px] ${
                  item === createEventComponent ? 'gradient-bg font-bold text-white' : 'bg-body text-secondary'
                } cursor-pointer disabled:cursor-not-allowed`}
                key={idx}
                disabled={!enabled || previousTabsHaveEmptyFields}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>
      <div className='w-full'>{renderComponent()}</div>
    </Modal>
  )
}

export default Index
