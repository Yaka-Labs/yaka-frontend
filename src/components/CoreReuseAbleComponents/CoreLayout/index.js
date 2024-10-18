import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// import OutsideClickHandler from 'react-outside-click-handler'
import { CoreSubMenus } from 'config/constants/core'
// import SearchInput from 'components/Input/SearchInput'
import LeftLayout from './leftLayout'
import RightLayout from './rightLayout'

const Index = ({ children }) => {
  // const [search, setSearch] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isSideHide = useMemo(() => {
    return location.pathname.includes('/trade')
  }, [location])
  // const [mobileSideBar, setMobileSideBar] = useState(false)
  // const [recent, setRecent] = useState([
  //   {
  //     name: 'Theseus',
  //     img: '/images/core/p1.png',
  //     status: '',
  //   },
  //   {
  //     name: 'Xermes',
  //     img: '/images/core/p1.png',
  //     status: 'Following',
  //   },
  //   {
  //     name: 'Wunderbit Trading Competition 19 Mar',
  //     img: '/images/core/p1.png',
  //     status: 'Joined',
  //   },
  // ])
  // const [recentSearch, setRecentSearch] = useState('')

  // const filterRecent = useMemo(() => {
  //   let filteredData = recentSearch ? recent.filter((item) => item.name.toLowerCase().includes(recentSearch.toLowerCase())) : recent
  //   return filteredData
  // }, [recent, recentSearch])
  return (
    <div className='px-5 sm:px-16 pt-20 md:pt-[100px] grid xl:grid-cols-5 gap-3 lg:gap-5 lg:pb-[75px]  w-full'>
      {/* left side */}
      {!isSideHide && (
        <div className='w-full xl:relative  absolute hidden xl:block'>
          <LeftLayout />
        </div>
      )}
      {/* middle */}
      <div className={`w-full ${isSideHide ? 'xl:col-span-5' : 'xl:col-span-3'}`}>
        {/* <div className='flex items-center justify-between sticky top-[70px] md:top-[76px] xl:hidden bg-body z-30 pb-[15px]'>
          <img onClick={() => setMobileSideBar(!mobileSideBar)} alt='' src='/images/core/p1.png' className='w-9 h-9 cursor-pointer' />
          <button onClick={() => setSearch(!search)}>
            <img alt='search icon' src='/images/core/search-mobile.svg' />
          </button>
        </div> */}

        <div className='w-full'>{children}</div>
      </div>

      {/* right */}
      {!isSideHide && (
        <div className='w-full xl:relative absolute hidden xl:block'>
          <RightLayout />
        </div>
      )}

      {/* bottom navigation for mobile */}
      <div className='fixed bg-body w-full bottom-0 xl:hidden z-30 px-6 inset-x-0  h-14 flex items-center justify-between'>
        {CoreSubMenus.slice(0, 5).map((item) => {
          return (
            <button
              onClick={() => {
                if (item.enabled) navigate(item.route)
              }}
              disabled={!item.enabled}
              key={item.name}
              className={`${
                location.pathname.includes(item.route) ? 'text-green font-medium hover:text-green transition-all duration-200 ease-in-out' : 'text-[#b8b6cb]'
              } disabled:cursor-not-allowed text-sm lg:text-[17px] items-center space-y-[3px] lg:space-y-0 justify-center lg:justify-start lg:space-x-[18.73px]
              cursor-pointer flex flex-col lg:flex-row`}
            >
              {location.pathname.includes(item.route) ? item.active : item.svg}
            </button>
          )
        })}
      </div>

      {/* recent search UI for mobile */}
      {/* <div
        className={`${search ? 'top-0' : 'top-[-100%]'} fixed w-full xl:hidden inset-0 h-full z-[200] transition-all duration-300 bg-[#1A265E] ease-in-out p-5`}
      >
        <div className='flex items-center space-x-3'>
          <button onClick={() => setSearch(false)}>
            <img src='/images/swap/back-arrow.svg' alt='' />
          </button>
          <SearchInput disableSearchIcon setSearchText={setRecentSearch} searchText={recentSearch} placeholder='Search' full />
        </div>
        <div className='mt-3'>
          <div className='flex items-center justify-between'>
            <span className='text-lg leading-[22px] font-medium font-figtree text-white'>Recent</span>
            {filterRecent.length > 0 && (
              <button onClick={() => setRecent([])} className='text-green font-medium leading-5 text-[15px]'>
                Clear all
              </button>
            )}
          </div>
          <div className='mt-4'>
            {filterRecent.length > 0 ? (
              filterRecent.map((item, idx) => {
                return (
                  <div key={idx} className='flex items-center justify-between mb-6'>
                    <div className='flex items-center space-x-3'>
                      <img alt='' className='w-8 h-8' src={item.img} />
                      <div>
                        <span className='text-white font-figtree leading-[18px] font-medium'>{item.name}</span>
                        {item.status && <p className='text-secondary leading-4'>{item.status}</p>}
                      </div>
                    </div>
                    <button onClick={() => setRecent((prev) => prev.filter((_, i) => i !== idx))} className=' w-2.5 h-2.5'>
                      <img alt='' src='/images/core/mini-close.svg' />
                    </button>
                  </div>
                )
              })
            ) : (
              <p className='w-full text-center mt-5 text-lightGray leading-5 font-figtree font-medium'>No recent searches.</p>
            )}
          </div>
        </div>
      </div> */}
      {/* mobile sidebar */}
      {/* <OutsideClickHandler
        onOutsideClick={() => {
          setMobileSideBar(false)
        }}
      >
        <div
          className={`w-full max-w-[294px] top-0 fixed bg-[#1A265E] min-h-screen z-[200] p-6 ${
            mobileSideBar ? 'left-0' : 'left-[-100%]'
          } transition-all duration-300 ease-in-out`}
        >
          <img alt='' src='/images/core/p1.png' className='w-[50px] h-[50px]' />
          <div className='border-b border-[#7A7FB9] pb-[22px] mt-3.5 mb-6'>
            <div className='flex items-center space-x-1'>
              <span className='text-lg leading-[22px] font-figtree font-medium text-white'>John Doe</span>
              <img className='rotate-180' alt='' src='/images/header/dropdown-arrow.svg' />
            </div>
            <span className='text-sm leading-4 text-secondary mt-0.5'>0x8f4f····4f24</span>
          </div>
          <button
            onClick={() => {
              navigate('/core/mint')
            }}
            className={` text-[15px] items-center justify-start space-x-[18.73px] ${
              location.pathname === '/core/mint' ? 'text-green font-medium hover:text-green transition-all duration-200 ease-in-out' : 'text-[#b8b6cb]'
            }    cursor-pointer flex`}
          >
            {location.pathname === '/core/mint' ? (
              <svg xmlns='http://www.w3.org/2000/svg' width='22.001' height={22} viewBox='0 0 22.001 22'>
                <g id='mint' transform='translate(0.001 0.208)'>
                  <rect id='Rectangle_14084' data-name='Rectangle 14084' width={22} height={22} transform='translate(0 -0.208)' fill='none' />
                  <path
                    id='Union_663'
                    data-name='Union 663'
                    d='M17.579,21.242l-6.316-6.308-2.138,2.14a2.773,2.773,0,0,1-3.9,0L.8,12.656a2.772,2.772,0,0,1,0-3.894L2.941,6.616l-.6-.6a1.743,1.743,0,0,1,0-2.459l1.205-1.21a1.741,1.741,0,0,1,2.464,0l.6.595L8.745.807a2.763,2.763,0,0,1,3.9,0L17.068,5.23a2.763,2.763,0,0,1,0,3.895l-2.138,2.14,6.31,6.318a2.59,2.59,0,0,1-3.665,3.66Zm-5.324-7.3,6.316,6.305a1.185,1.185,0,0,0,.836.35h.013a1.163,1.163,0,0,0,.959-.505,1.18,1.18,0,0,0-.127-1.52l-6.31-6.315ZM9.737,1.8,1.792,9.75a1.36,1.36,0,0,0-.393.958,1.341,1.341,0,0,0,.4.955l4.423,4.415a1.37,1.37,0,0,0,1.919,0l7.942-7.939a1.362,1.362,0,0,0,0-1.915L11.651,1.8a1.361,1.361,0,0,0-1.914,0ZM4.54,3.343,3.333,4.548a.34.34,0,0,0,0,.475l.6.6L5.617,3.938l-.6-.6a.337.337,0,0,0-.238-.094A.356.356,0,0,0,4.54,3.343Z'
                    transform='translate(0 -0.208)'
                    fill='#26fffe'
                  />
                </g>
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' width='22.001' height={22} viewBox='0 0 22.001 22'>
                <g id='mint' transform='translate(0.001 0.208)'>
                  <rect id='Rectangle_14084' data-name='Rectangle 14084' width={22} height={22} transform='translate(0 -0.208)' fill='none' />
                  <path
                    id='Union_663'
                    data-name='Union 663'
                    d='M17.579,21.242l-6.316-6.308-2.138,2.14a2.773,2.773,0,0,1-3.9,0L.8,12.656a2.772,2.772,0,0,1,0-3.894L2.941,6.616l-.6-.6a1.743,1.743,0,0,1,0-2.459l1.205-1.21a1.741,1.741,0,0,1,2.464,0l.6.595L8.745.807a2.763,2.763,0,0,1,3.9,0L17.068,5.23a2.763,2.763,0,0,1,0,3.895l-2.138,2.14,6.31,6.318a2.59,2.59,0,0,1-3.665,3.66Zm-5.324-7.3,6.316,6.305a1.185,1.185,0,0,0,.836.35h.013a1.163,1.163,0,0,0,.959-.505,1.18,1.18,0,0,0-.127-1.52l-6.31-6.315ZM9.737,1.8,1.792,9.75a1.36,1.36,0,0,0-.393.958,1.341,1.341,0,0,0,.4.955l4.423,4.415a1.37,1.37,0,0,0,1.919,0l7.942-7.939a1.362,1.362,0,0,0,0-1.915L11.651,1.8a1.361,1.361,0,0,0-1.914,0ZM4.54,3.343,3.333,4.548a.34.34,0,0,0,0,.475l.6.6L5.617,3.938l-.6-.6a.337.337,0,0,0-.238-.094A.356.356,0,0,0,4.54,3.343Z'
                    transform='translate(0 -0.208)'
                    fill='#b8b6cb'
                  />
                </g>
              </svg>
            )}
            <p>Mint THENA ID</p>
          </button>
          {CoreSubMenus.slice(5, 10).map((item) => {
            return (
              <button
                onClick={() => {
                  if (item.enabled) navigate(item.route)
                }}
                disabled={!item.enabled}
                key={item.name}
                className={`mt-[23.63px] disabled:cursor-not-allowed text-[15px] items-center justify-start space-x-[18.73px]  ${
                  location.pathname === item.route ? 'text-green font-medium hover:text-green transition-all duration-200 ease-in-out' : 'text-[#b8b6cb]'
                }    cursor-pointer flex`}
              >
                {location.pathname === item.route ? item.active : item.svg}
                <p>{item.name}</p>
              </button>
            )
          })}
        </div>
      </OutsideClickHandler> */}
    </div>
  )
}

export default Index
