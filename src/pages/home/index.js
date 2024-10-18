import React from 'react'
import Hero from './components/hero'
import Details from './components/details'
import Statue from './components/statue'
import How from './components/how'
import Diagram from './components/diagram'
import Team from './components/team'
import Start from './components/start'
import Roadmap from './components/roadmap'
import './home.scss'

const Home = () => {
  return (
    <>
      <Hero />
      <Details />
      <Statue />
      <How />
      <Diagram />
      <Roadmap />
      <Team />
      <Start />
    </>
  )
}

export default Home
