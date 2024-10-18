import React from 'react'

const Index = () => {
  // description html
  const data = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet
   justo interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet, consectetur adipiamet
   justo interdum rutrum a in tortosque suscipit nibh quis que suscipit nibh quis. Lorem ipsum dolor sit que suscipit nibh quis.
   Lorem ipsum dolor sit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum
   rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet, consectetur adipiamet justo interdum rutrum a in
   tortosque suscipit nibh quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo
   interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet, consectetur adipiamet justo interdum rutrum
   a in tortosque suscipit nibh quis que suscipit nibh quis. Lorem ipsum dolor sit que suscipit nibh quis. Lorem ipsum dolor sit .</p>
  `

  const profiles = [
    {
      name: 'Xermes',
      twitter: 'https://twitter.com/',
      title: 'Host',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
    },
    {
      img: '/images/core/p3.png',
      name: 'Xermes',
      twitter: 'https://twitter.com/',
    },
  ]

  return (
    <div className='bg-[#101645] rounded-[5px] px-5 py-6 mt-5'>
      <p className='text-[22px] leading-[27px] text-lightGray font-semibold font-figtree'>Description</p>
      <div dangerouslySetInnerHTML={{ __html: data }} className='mt-1.5 pb-2.5 mb-[30px] border-b border-[#44476A]' id='description-data' />
      <p className='text-[22px] leading-[27px] text-lightGray font-semibold font-figtree'>Speakers & Host</p>
      <div className='mt-5 grid grid-cols-3'>
        {profiles.map((item, idx) => {
          return (
            <div key={idx} className=' flex items-start space-x-2'>
              <img alt='' className='w-[50px] h-[50px] rounded-full' src={item.img ? item.img : '/images/core/speaker-profile.png'} />
              <div>
                <p className='text-lg leading-[22px] font-semibold font-figtree text-white'>{item.name}</p>
                {item.twitter && (
                  <a href={item.twitter} rel='nofollow noopener' target='__blank' className='text-[15px] leading-5 text-green'>
                    X
                  </a>
                )}
                {item.title && <div className=' px-[5px] table py-[3px] bg-blue text-white rounded text-[13px] leading-4'>{item.title}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Index
