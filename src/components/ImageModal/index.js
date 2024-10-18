import React from 'react'

const ImageModal = ({ closeModel, modal, imgSrc }) => {
  return (
    <div
      className={`
    ${modal ? 'z-[203] visible opacity-100' : 'z-[-1] invisible opacity-0'}
    fixed z-40 h-full w-full inset-0 transition-all duration-200 ease-in-out`}
    >
      <div
        onClick={() => closeModel()}
        className='  w-full inset-0 fixed   flex items-center min-h-screen justify-center flex-col paraent bg-opacity-[0.88] bg-body'
      />
      {imgSrc && <img alt='' src={imgSrc} className='max-w-[600px] max-h-[600px] absolute inset-0 m-auto  object-cover object-center h-full w-full ' />}
    </div>
  )
}

export default ImageModal
