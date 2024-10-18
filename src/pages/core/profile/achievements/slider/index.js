import React from 'react'
// import { Navigation } from 'swiper/modules'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'

const Index = ({ className, id }) => {
  // const [popper, setPopper] = useState(false)
  return (
    <div className={`w-full ${className}`}>
      <div className=' absolute flex space-x-3 top-5 right-5'>
        <button id={`swiper-button-prev-${id}`} className=' disabled:!cursor-not-allowed disabled:!opacity-40'>
          <img alt='arrow button left' src='/images/profile/arrow-left.png' />
        </button>
        <button id={`swiper-button-next-${id}`} className='rotate-180 disabled:!cursor-not-allowed disabled:!opacity-40'>
          <img alt='arrow button left' src='/images/profile/arrow-left.png' />
        </button>
      </div>
      {/* <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `#swiper-button-prev-${id}`,
          nextEl: `#swiper-button-next-${id}`,
        }}
        spaceBetween={14}
        slidesPerView={4.7}
        className='w-full'
      >
        {data.map((item, idx) => {
          return (
            <SwiperSlide key={idx} className='w-full'>
              <div className='w-full flex flex-col items-center justify-center bg-cardBg'>
                <div className='max-w-[160px] w-full flex flex-col items-center justify-center'>
                  <img
                    className={`${(item.points / item.total) * 100 < 100 ? ' mix-blend-luminosity opacity-[0.25]' : ''} w-[104px] h-[104px]`}
                    src={item.badgeImg}
                    alt=''
                  />
                  <div className='flex flex-col items-center justify-center w-full max-w-[146px]'>
                    <div className='text-lightGray text-[13px] leading-4'>
                      {item.points}/{item.total}
                    </div>
                    <div className='px-6 w-full mt-1.5'>
                      <div className='w-full h-[3px] bg-[#272845] rounded-full'>
                        <div
                          style={{ width: `${(item.points / item.total) * 100}%` }}
                          className='gradient-bg h-[3px] transition-all duration-200 ease-in-out rounded-full'
                        />
                      </div>
                    </div>
                    <p className='text-xl leading-5 font-semibold font-figtree text-white text-center mt-2.5'>{item.title}</p>
                    <p className='text-sm leading-[18px]  text-secondary text-center mt-0.5'>{item.des}</p>
                    {item.percent && (
                      <div
                        onMouseEnter={() => setPopper(idx)}
                        onMouseLeave={() => setPopper(null)}
                        className='flex cursor-pointer relative items-center space-x-1 w-full justify-center mt-2 '
                      >
                        <img alt='' className='h-4 w-4' src='/images/profile/nfts/user-icon.svg' />
                        <span className='text-[15px] leading-5 text-white'>{item.percent}%</span>
                        <div
                          className={`px-3.5 py-2 bg-[#1A265E] rounded-[5px] text-white  text-[15px] leading-5
                          absolute bottom-6 transition-all duration-200 ease-in-out ${popper === idx ? ' opacity-100 z-20' : ' opacity-0 z-[-1]'}`}
                        >
                          <p>{item.percent}% of all users completed this.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper> */}
    </div>
  )
}

export default Index
