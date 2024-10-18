import React, { useEffect, useState } from 'react'
import InputEmoji from 'react-input-emoji'

const Index = ({ inputs, setInputs }) => {
  const [userName, setUserName] = useState({
    e: '',
    idx: 0,
  })
  useEffect(() => {
    const dup = [...inputs]
    dup[userName.idx].value = userName.e?.replace(/\s/g, '')
    setInputs([...dup])
  }, [userName])

  const changeHandler = (e, idx) => {
    let value = e.replace(/\s/g, '')
    setUserName({ value, idx })
  }

  return (
    <div className='flex flex-col items-center justify-center w-full mt-[18px] md:mt-4'>
      {inputs.map((item, idx) => {
        return (
          <div key={idx} className={`w-full ${idx > 0 ? 'mt-4' : ''}`}>
            <p className='text-lightGray text-[13px] md:text-base leading-4 md:leading-5  w-full'>Your THENA ID {inputs.length > 1 ? idx + 1 : ''}</p>
            <div className='gradient-bg mt-1.5 md:mt-2 p-px w-full rounded-[3px]'>
              <div className='bg w-full  rounded-[3px] text-base lg:!text-[22px]  relative'>
                <InputEmoji
                  value={item.value}
                  onChange={(e) => {
                    changeHandler(e, idx)
                  }}
                  maxLength={32}
                  cleanOnEnter
                  placeholder='example.thena'
                />
                <button className='absolute z-20 right-[50px] top-4'>
                  <img alt='' src='/images/mintId/dice.svg' />
                </button>
                {item.value && <span className='absolute text-[#757384]  right-24 top-3.5 lg:top-[18px] z-20'>.thena</span>}
              </div>
            </div>
          </div>
        )
      })}
      <div className='flex items-center space-x-3 mt-3'>
        <button
          onClick={() => {
            if (inputs.length > 1) inputs.pop()
            setInputs([...inputs])
            console.log('trigger')
          }}
          disabled={inputs.length <= 1}
          className='bg-error disabled:!cursor-not-allowed disabled:!opacity-50  w-8 h-8 flex flex-col items-center justify-center rounded-[3px]'
        >
          <img src='/images/svgs/minus.svg' alt='minus icon' />
        </button>
        <button
          onClick={() => {
            if (inputs.length <= 10) {
              setInputs([
                ...inputs,
                {
                  value: '',
                },
              ])
            }
          }}
          disabled={inputs.length === 10}
          className='bg-success disabled:!cursor-not-allowed disabled:!opacity-50 w-8 h-8 flex flex-col items-center justify-center rounded-[3px]'
        >
          <img src='/images/svgs/plus.svg' alt='plus icon' />
        </button>
      </div>
    </div>
  )
}

export default Index
