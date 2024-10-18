import React from 'react'
import StyledButton from 'components/Buttons/styledButton'

const Index = ({ headers, rows, parentStyles = '' }) => {
  return (
    <div className={`${parentStyles} w-full !overflow-auto   max-h-[277px]`}>
      <table className='w-full whitespace-nowrap'>
        <tr>
          {headers.map((item, idx) => {
            return (
              <td key={idx} className=' text-base leading-5 font-semibold font-figtree text-white pl-4'>
                <div className='py-3.5'> {item}</div>
              </td>
            )
          })}
        </tr>
        <tbody>
          {rows.map((item, idx) => {
            return (
              <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white bg-opacity-[0.03]' : ''}   w-full  text-[15px] leading-[22px]  font-semibold`}>
                {Object.entries(item).map(([key, value]) => {
                  return key === 'button' ? (
                    <td>
                      <div className='flex justify-end py-2.5 pr-4'>
                        <StyledButton content={value} className='py-[7px] px-4' />
                      </div>
                    </td>
                  ) : (
                    <td className={`${key === 'from' ? ' text-green' : 'text-lightGray '} px-4 py-2.5`} key={idx + 1}>
                      {value}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Index
