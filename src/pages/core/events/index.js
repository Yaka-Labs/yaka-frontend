import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import EventsFeed from './eventsFeed'
import CreateEventFlow from './createEvent'
import PreviewEvents from './previewEvent'

const Events = () => {
  const [eventsFeedData, setEventsFeedData] = useState([
    {
      img: '/images/core/eventPic.png',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 0,
      name: 'Ankr Discord AMA',
      event: 'LIVE',
      eventType: 'Audio Event',
      people: '946',
      total: '',
      timeRemaining: '1h 20m',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Ankr Discord',
    },
    {
      img: '',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 1,
      name: 'Thena Meme Contest',
      event: 'UPCOMING',
      eventStatus: '',
      eventType: 'Video Event',
      people: '22',
      total: '100',
      timeRemaining: '1h',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Thena Discord',
    },
    {
      img: '',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 2,
      name: 'Thena Meme Contest',
      event: 'UPCOMING',
      eventStatus: '',
      eventType: 'Meme Contest',
      people: '22',
      total: '100',
      timeRemaining: '1h',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Thena Discord',
    },
    {
      img: '',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 3,
      name: 'BNB Chain Innovation Talks with Pendle Finance & Thena',
      event: 'LIVE',
      eventType: 'Video Event',
      people: '22',
      total: '',
      timeRemaining: '1h',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Thena Discord',
    },
    {
      img: '/images/core/eventPic.png',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 4,
      name: 'Ankr Discord AMA',
      event: 'LIVE',
      eventType: 'Audio Event',

      people: '946',
      total: '',
      timeRemaining: '1h 20m',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Ankr Discord',
    },
    {
      img: '',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 5,
      name: 'Thena Meme Contest',
      event: 'UPCOMING',
      eventStatus: '',
      eventType: 'Video Event',
      people: '22',
      total: '100',
      timeRemaining: '1h',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Thena Discord',
    },
    {
      img: '/images/core/eventPic.png',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 6,
      name: 'Ankr Discord AMA',
      event: 'LIVE',
      eventType: 'Meme Contest',
      people: '946',
      total: '',
      timeRemaining: '1h 20m',
      locationLink: 'https://discord.gg/yaka-finance/',
      location: 'Ankr Discord',
    },
    {
      img: '',
      time: 'Mar 18, 2023, 4 PM UTC',
      id: 7,
      name: 'Thena Meme Contest',
      event: 'ENDED',
      eventType: 'Video Event',
      people: '22',
      total: '',
      timeRemaining: '1h',
      locationLink: 'https://twitter.com/',
      location: 'Twitter Spaces',
    },
  ])
  const [createEvent, setCreateEvent] = useState(false)
  const [createEventComponent, setCreateEventComponent] = useState('DETAILS')
  const mainData = useSelector((state) => state.application.eventsData)

  return (
    <>
      <EventsFeed eventsFeedData={eventsFeedData} setCreateEvent={setCreateEvent} setEventsFeedData={setEventsFeedData} />
      <CreateEventFlow
        createEventComponent={createEventComponent}
        setCreateEventComponent={setCreateEventComponent}
        setCreateEvent={setCreateEvent}
        createEvent={createEvent}
      />
      {Object.keys(mainData).length > 0 && (
        <PreviewEvents setCreateEvent={setCreateEvent} setCreateEventComponent={setCreateEventComponent} mainData={mainData} />
      )}
    </>
  )
}

export default Events
