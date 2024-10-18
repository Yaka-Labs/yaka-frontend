import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchInput from 'components/Input/SearchInput'
import Toggle from 'components/Toggle'
import TransparentButton from 'components/Buttons/transparentButton'
import CommonInput from 'components/Input/commonInput'

const ThenaIds = () => {
  const [searchText, setSearchText] = useState('')
  const [Ids, setIDs] = useState(true)
  const [minPrice, setMinPrice] = useState()
  const [maxPrice, setMaxPrice] = useState()
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(16)

  const data = [
    {
      name: 'hyperion.thena',
      price: 20,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususzz',
      price: 10,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },

    {
      name: 'hyperion.thena',
      price: 48,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },
    {
      name: 'hyperion.thena',
      price: 48,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },
    {
      name: 'hyperion.thena',
      price: 100,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },

    {
      name: 'hyperion.thena',
      price: 40,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 81,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },
    {
      name: 'hyperion.thena',
      price: 60,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 100,
    },
    {
      name: 'hyperion.thena',
      price: 48,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 37,
    },

    {
      name: 'kallikrates.thena',
      price: 33,
    },

    {
      name: 'hyperion.thena',
      price: 32,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 67,
    },

    {
      name: 'kallikrates.thena',
      price: 48,
    },
    {
      name: 'hyperion.thena',
      price: 5,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 45,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },
    {
      name: 'hyperion.thena',
      price: 48,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },

    {
      name: 'hyperion.thena',
      price: 48,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },
    {
      name: 'hyperion.thena',
      price: 48,
    },
    {
      name: 'kallikrates.thena',
      price: null,
      ownedBy: 'lorem ipsumdolfno…',
    },

    {
      name: 'loremipsumdolorususo .thena',
      price: 23,
    },

    {
      name: 'kallikrates.thena',
      price: 12,
    },
  ]

  const [categories, setCategories] = useState([
    {
      filter: 'Character Set',
      value: false,
      subCategory: [
        {
          filter: 'Letter',
          value: false,
        },
        {
          filter: 'Digit',
          value: false,
        },
        {
          filter: 'Alphanumeric',
          value: false,
        },
        {
          filter: 'Mixed',
          value: false,
        },
        {
          filter: 'Emoji',
          value: false,
        },
      ],
    },
    {
      filter: 'Created Date - Unix time',
      range: true,
      from: '',
      to: '',
    },
    {
      filter: 'Username Length',
      range: true,
      from: '',
      to: '',
    },
    {
      filter: 'ID',
      range: true,
      from: '',
      to: '',
    },
    {
      filter: 'Numeral Clubs',
      value: false,
      subCategory: [
        {
          filter: '10 club (1 digit)',
          value: false,
        },
        {
          filter: '100 club (2 digits)',
          value: false,
        },
        {
          filter: '1000 club (3 digits)',
          value: false,
        },
        {
          filter: '10k club (4 digits)',
          value: false,
        },
        {
          filter: '1m club (6 digits)',
          value: false,
        },
      ],
    },
    {
      filter: 'Negative Numeral Clubs',
      value: false,
      subCategory: [
        {
          filter: '-10 club (1 negative digit)',
          value: false,
        },
        {
          filter: '-100 club (2 negative digits)',
          value: false,
        },
        {
          filter: '-1000 club (3 negative digits)',
          value: false,
        },
        {
          filter: '-10k club (4 negative digits)',
          value: false,
        },
        {
          filter: '-100k club (5 negative digits)',
          value: false,
        },
        {
          filter: '-1m club (6 negative digits)',
          value: false,
        },
      ],
    },
    {
      filter: 'Arabic Numeral Clubs',
      value: false,
      subCategory: [
        {
          filter: 'Arabic 10 club (1 arabic digit)',
          value: false,
        },
        {
          filter: 'Arabic 100 club (2 arabic digits)',
          value: false,
        },
        {
          filter: 'Arabic 1000 club (3 arabic digits)',
          value: false,
        },
        {
          filter: 'Arabic 10k club (4 arabic digits)',
          value: false,
        },
        {
          filter: 'Arabic 100k club (5 arabic digits)',
          value: false,
        },
        {
          filter: 'Arabic 1m club (6 arabic digits)',
          value: false,
        },
      ],
    },

    {
      filter: 'Hindi Numeral Clubs',
      value: false,
      subCategory: [
        {
          filter: 'Hindi 10 club (1 hindi digit)',
          value: false,
        },
        {
          filter: 'Hindi 100 club (2 hindi digits)',
          value: false,
        },
        {
          filter: 'Hindi 1000 club (3 hindi digits)',
          value: false,
        },
        {
          filter: 'Hindi 10k club (4 hindi digits)',
          value: false,
        },
        {
          filter: 'Hindi 100k club (5 hindi digits)',
          value: false,
        },
        {
          filter: 'Hindi 1m club (6 hindi digits)',
          value: false,
        },
      ],
    },
    {
      filter: 'Emoji Numeral Clubs',
      value: false,
      subCategory: [
        {
          filter: 'Emoji 10 club (1 emoji digit)',
          value: false,
        },
        {
          filter: 'Emoji 100 club (2 emoji digits)',
          value: false,
        },
        {
          filter: 'Emoji 1000 club (3 emoji digits)',
          value: false,
        },
        {
          filter: 'Emoji 10k club (4 emoji digits)',
          value: false,
        },
        {
          filter: 'Emoji 100k club (5 emoji digits)',
          value: false,
        },
        {
          filter: 'Emoji 1m club  (6 emoji digits)',
          value: false,
        },
      ],
    },
    {
      filter: 'Emoji Clubs',
      value: false,
      subCategory: [
        {
          filter: '1 Emoji',
          value: false,
        },
        {
          filter: '2 Emojis',
          value: false,
        },
        {
          filter: '3 Emojis',
          value: false,
        },
        {
          filter: '4 Emojis',
          value: false,
        },
        {
          filter: '5 Emojis',
          value: false,
        },
      ],
    },
    {
      filter: 'English Clubs',
      value: false,
      subCategory: [
        {
          filter: 'English Verbs',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/verbs.txt',
        },
        {
          filter: 'English Nouns',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/nouns.txt',
        },
        {
          filter: 'English Adjectives',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/adjectives.txt',
        },
        {
          filter: 'English First Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/firstnames.txt',
        },
        {
          filter: 'English Last names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/lastnames.txt',
        },
        {
          filter: 'English Male First Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/male_names.txt',
        },
        {
          filter: 'English Female First Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/female_names.txt',
        },
        {
          filter: 'Dictionary Words (1 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (2 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (3 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (4 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (5 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (6 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (7 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (8 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (9 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (10 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (11 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (12 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (13 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (14 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
        {
          filter: 'Dictionary Words (15 Letter)',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/01_letter_words.txt',
        },
      ],
    },
    {
      filter: 'Other',
      value: false,
      subCategory: [
        {
          filter: 'Company Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/companies.txt',
        },
        {
          filter: 'Continent Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/continents.txt',
        },
        {
          filter: 'Country Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/countries.txt',
        },
        {
          filter: 'Capital Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/capitals.txt',
        },
        {
          filter: 'City Names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/cities.txt',
        },
        {
          filter: 'Country Codes',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/countrycodes.txt',
        },
        {
          filter: 'Fruit names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/fruits.txt',
        },
        {
          filter: 'Vegetable names',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/english_words_lists/vegetables.txt',
        },
        {
          filter: 'Greek gods',
          value: false,
          link: 'https://github.com/ThenafiBNB/THENA/blob/main/scripts/UsernameNFT/js/usernamenfts/other_lists/_greekgods.txt',
        },
      ],
    },
  ])

  const [subCategory, setSubCategory] = useState()

  const handleSubCategory = (item, idx, j) => {
    let dup = [...categories]
    dup[idx].subCategory[j].value = !item.value
    setCategories(dup)
  }

  const filteredData = useMemo(() => {
    let filter = []
    if (searchText) {
      filter = data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    } else if (minPrice || maxPrice || start || end) {
      filter = data.filter((item) => {
        return item.price && minPrice && maxPrice && start?.length > 0 && end?.length > 0
          ? item.price >= minPrice && item.price <= maxPrice && item.name.startsWith(start[0]) && item.name.endsWith(end[0])
          : item.price && maxPrice && minPrice
          ? item.price >= minPrice && item.price <= maxPrice
          : start?.length > 0 && end?.length > 0
          ? item.name.startsWith(start[0]) && item.name.endsWith(end[0])
          : item.price && minPrice && start?.length > 0
          ? item.price >= minPrice && item.name.startsWith(start[0])
          : item.price && minPrice && end?.length > 0
          ? item.price >= minPrice && item.name.endsWith(end[0])
          : item.price && maxPrice && start?.length > 0
          ? item.price >= maxPrice && item.name.startsWith(start[0])
          : item.price && maxPrice && end?.length > 0
          ? item.price >= maxPrice && item.name.endsWith(end[0])
          : item.price && maxPrice
          ? item.price <= maxPrice
          : item.price && minPrice
          ? item.price >= minPrice
          : start
          ? item.name.startsWith(start[0])
          : end
          ? item.name.endsWith(end[0])
          : data
      })
    } else {
      filter = data
    }
    // if (minPrice || maxPrice) {
    //   filter = data.filter((item) => {
    //     return item.price && minPrice && maxPrice && start && end
    //       ? item.price >= minPrice && item.price <= maxPrice && item.name.startsWith(start[0]) && item.name.endsWith(end[0])
    //       : minPrice
    //       ? item.price > minPrice
    //       : maxPrice
    //       ? item.price && item.price < maxPrice
    //       : data
    //   })
    // } else if (start || end) {
    //   filter = data.filter((item) => {
    //     return start && end
    //       ? item.name.startsWith(start[0]) && item.name.endsWith(end[0])
    //       : start
    //       ? item.name.startsWith(start[0])
    //       : end
    //       ? item.name.endsWith(end[0])
    //       : data
    //   })
    // } else {
    //   filter = data
    // }

    return filter
  }, [data, minPrice, maxPrice, start, end])

  const rangeHandler = (idx, key, val) => {
    let dup = [...categories]
    if (key === 'to') {
      dup[idx].to = val
    } else {
      dup[idx].from = val
    }
    setCategories(dup)
  }

  return (
    <>
      <div className='flex items-start space-x-5 w-full'>
        <div className='w-full max-w-[940px] 2xl:max-w-full'>
          <div className='flex items-center space-x-[30px]'>
            <div className='max-w-[300px] w-full'>
              <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search ID' full />
            </div>
            <div className='flex items-center space-x-2'>
              <Toggle toggleId='hidePassword' checked={Ids} onChange={() => setIDs(!Ids)} />
              <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>Show only available IDs</p>
            </div>
          </div>
          <div className='flex items-center flex-col justify-center w-full'>
            <div className='grid grid-cols-4 gap-5 w-full mt-5'>
              {filteredData?.slice(0, showMore).map((item, idx) => {
                return (
                  <Link
                    to={`/core/thenaIds/${idx}`}
                    key={idx}
                    className='border cursor-pointer transition-all duration-200 ease-in-out group hover:shadow-[0px_0px_40px_#0000A8] border-blue rounded-[5px]  bg-cardBg  relative'
                  >
                    <div className='p-2.5'>
                      <div className='h-[168px] w-full gradient-bg flex items-center justify-between flex-col py-5'>
                        <p className='text-white font-figtree font-bold text-2xl'>THENA</p>
                        <p className='text-white font-figtree text-lg font-medium'>username.eth</p>
                      </div>
                      <p className='text-white leading-5 font-medium font-figtree mt-1 absolute break-all'>{item.name}</p>
                      <div className='h-10 w-full' />
                      <div className='mt-3'>
                        {item.ownedBy ? (
                          <>
                            <p className='text-[13px] leading-4 text-lightGray'>Owned by</p>
                            <p className='text-[15px] leading-5 text-green font-medium'>{item.ownedBy}</p>
                          </>
                        ) : (
                          <>
                            <p className='text-[13px] leading-4 text-lightGray'>Mint Price</p>
                            <p className='text-xl leading-6 text-white font-semibold'>${item.price}</p>
                          </>
                        )}
                      </div>
                    </div>
                    {!item.ownedBy && (
                      <button className='py-3 rounded-[5px] bg-blue opacity-0 group-hover:opacity-100 text-center w-full absolute text-lg leading-[22px] text-white font-figtree font-semibold transition-all duration-200 ease-in-out  bottom-0'>
                        Mint Now
                      </button>
                    )}
                  </Link>
                )
              })}
            </div>
            {data.length > 16 && (
              <button
                onClick={() => {
                  setShowMore(showMore + 6)
                }}
                className={`${data.length <= showMore - 1 ? 'hidden' : ''} text-green text-xl leading-6 font-medium mt-[30px]`}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='max-w-[260px] w-full'>
        <TransparentButton
          onClickHandler={() => {
            navigate('/core/-thena-id')
          }}
          className='px-[27px] py-4'
          content='MINT CUSTOM THENA ID'
          isUpper
        />
        <div className='mt-5 pb-5 border-b border-[#44476A]'>
          <p className='text-white text-xl leading-6 font-medium font-figtree'>Price Range (in USD)</p>
          <div className='flex items-center space-x-3 mt-2'>
            <CommonInput value={minPrice} setValue={setMinPrice} className='px-3 py-[13.8px]' type='number' placeholder='Min Price' />
            <CommonInput value={maxPrice} setValue={setMaxPrice} className='px-3 py-[13.8px]' type='number' placeholder='Max Price' />
          </div>
        </div>
        <div className='mt-4 pb-5 border-b border-[#44476A]'>
          <p className='text-white text-xl leading-6 font-medium font-figtree'>Start/End With Letter</p>
          <div className='flex items-center space-x-3 mt-2'>
            <CommonInput value={start} setValue={setStart} className='px-3 py-[13.8px]' placeholder='Start' />
            <CommonInput value={end} setValue={setEnd} className='px-3 py-[13.8px]' placeholder='End' />
          </div>
        </div>
        <div className='mt-3.5'>
          <p className='text-white text-xl leading-6 font-medium font-figtree pr-5 '>Categories</p>
          <div className='mt-3 overflow-auto max-h-[400px] pr-5 '>
            {categories.map((item, idx) => {
              return (
                <>
                  <button
                    onClick={() => {
                      subCategory === item.filter ? setSubCategory(null) : setSubCategory(item.filter)
                    }}
                    key={idx}
                    disabled={item.subCategory?.length < 1}
                    // ${item.subCategory?.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}
                    className={` flex items-center justify-between group ${subCategory === item.filter ? 'mb-2 text-green' : 'mb-3 text-secondary'}  w-full`}
                  >
                    <div className='flex items-center space-x-1.5'>
                      <span>{item.filter}</span>
                    </div>
                    <svg
                      className={`${subCategory !== item.filter ? 'rotate-180' : ''} transform transition-all duration-200 ease-in-out`}
                      id='dropdown-arrow-reverse'
                      xmlns='http://www.w3.org/2000/svg'
                      width={16}
                      height={16}
                      viewBox='0 0 16 16'
                    >
                      <rect id='Rectangle_9202' data-name='Rectangle 9202' width={16} height={16} fill='none' />
                      <path
                        id='dropdown-arrow'
                        d='M1.092,0,0,1.092l5.7,5.7L0,12.493l1.092,1.092L7.884,6.792Z'
                        transform='translate(1.243 11.89) rotate(-90)'
                        fill='currentColor'
                      />
                    </svg>
                  </button>
                  {subCategory === item.filter && (
                    <>
                      {item.subCategory &&
                        item?.subCategory.map((_item, j) => {
                          return (
                            <div onClick={() => handleSubCategory(_item, idx, j)} key={idx + j} className='mb-2 cursor-pointer ml-5'>
                              <div className='flex items-center space-x-1.5'>
                                <div
                                  className={`${
                                    _item.value ? 'bg-blue border-transparent' : 'border-[#A09EB1] bg-body'
                                  } w-4 h-4 border rounded-[3px] flex flex-col items-center justify-center`}
                                >
                                  {_item.value && (
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      className='icon icon-tabler icon-tabler-check'
                                      width={12}
                                      height={12}
                                      viewBox='0 0 24 24'
                                      strokeWidth='1.5'
                                      stroke='#fff'
                                      fill='none'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    >
                                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                      <path d='M5 12l5 5l10 -10' />
                                    </svg>
                                  )}
                                </div>
                                {/* ${subCategory === item.filter ? 'text-green' : 'group-hover:text-green'} */}
                                <span className='text-lightGray  '>{_item.filter}</span>
                              </div>
                            </div>
                          )
                        })}
                      {item.range && (
                        <div className='flex items-center space-x-2.5 mb-3'>
                          <input
                            placeholder='1'
                            onChange={(e) => rangeHandler(idx, 'to', e.target.value)}
                            className='text-white font-medium placeholder-secondary focus-within:outline-none pl-3 pr-1.5 leading-5 border-blue border rounded-[3px] max-w-[130px] w-full h-[46px] bg-transparent'
                          />
                          <span className='leading-5 font-medium  text-white'>to</span>
                          <input
                            placeholder='10'
                            onChange={(e) => rangeHandler(idx, 'from', e.target.value)}
                            className='text-white font-medium placeholder-secondary focus-within:outline-none pl-3 pr-1.5 leading-5 border-blue border rounded-[3px] max-w-[130px] w-full h-[46px] bg-transparent'
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default ThenaIds
