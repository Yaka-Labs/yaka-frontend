import React, { useState, useMemo } from 'react'
import SearchInput from 'components/Input/SearchInput'
import LabelTooltip from 'components/TooltipLabelComponent'
import { ordinals } from 'utils'
import { formatNumber, fromWei, isInvalidAmount } from 'utils/formatNumber'
import './style.scss'

const Home = ({ data }) => {
  const [searchText, setSearchText] = useState('')
  const {
    competitionRules: { tradingTokens: tradableTokens },
  } = data

  const filteredTokens = useMemo(() => {
    return searchText ? tradableTokens.filter((asset) => asset.symbol.toLowerCase().includes(searchText.toLowerCase())) : tradableTokens
  }, [searchText, tradableTokens])

  const getPercentage = (val) => {
    let deductionFee = (Number(val) / 100) * ((data.prize.ownerFee / 1000) * 100)
    return ((val - deductionFee) / 1000) * 100
  }

  const prizeDistribution = useMemo(() => {
    const sortedWeights = data?.prize?.weights.sort((a, b) => {
      return b - a
    })
    return sortedWeights?.map((item) => {
      return {
        data: formatNumber(fromWei(data.prize.totalPrize, data.prize.token.decimals).times(getPercentage(item) / 100)),
        percenrage: `${formatNumber(getPercentage(item))}%`,
      }
    })
  }, [data])

  //  jsons for competition component
  const competition = useMemo(() => {
    const {
      entryFee,
      prize: { token: prizeToken, totalPrize, hostContribution },
      competitionRules: { startingBalance, winningToken },
    } = data
    return [
      {
        key: 'Participants',
        data: `${data.participantCount} / ${data.maxParticipants}`,
      },
      {
        key: 'Entry Fee',
        data: isInvalidAmount(entryFee) ? 'Free to join' : formatNumber(fromWei(entryFee, prizeToken.decimals)),
        ticker: isInvalidAmount(entryFee) ? null : prizeToken?.symbol,
      },
      {
        key: 'Competition Type',
        data: data?.market,
      },
      {
        key: 'Current Prize Pool',
        data: formatNumber(fromWei(totalPrize, prizeToken.decimals)),
        ticker: prizeToken?.symbol,
      },
      {
        key: 'Max Prize Pool',
        data: formatNumber(fromWei(totalPrize, prizeToken.decimals)),
        ticker: prizeToken?.symbol,
      },
      {
        key: 'Host Contribution',
        data: formatNumber(fromWei(hostContribution, prizeToken.decimals)),
        ticker: prizeToken?.symbol,
      },
      {
        key: 'Required Deposit To Join',
        data: isInvalidAmount(startingBalance) ? 'No Requirements' : formatNumber(fromWei(startingBalance, winningToken.decimals)),
        ticker: isInvalidAmount(startingBalance) ? '' : winningToken?.symbol,
      },
    ]
  }, [data])

  return (
    <div className='bg-[#101645] rounded-[5px] px-5 py-6 mt-5'>
      <p className='text-lg md:text-[22px] leading-[22px] md:leading-[27px] text-white font-semibold font-figtree'>Competition</p>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-x-[31px] gap-y-5 md:gap-y-[23px] mt-5 md:mt-[17px]'>
        {competition.map((item, idx) => {
          return (
            <div key={idx + 'competition'}>
              <div className='flex items-center space-x-1'>
                <p className='text-base md:text-[17px] text-lightGray leading-5 font-figtree'>{`${item.key}:`}</p>
                {item.key === 'Max Prize Pool' && <img alt='question mark icon' src='/images/swap/question-mark.png' />}
              </div>
              <div className='flex items-center space-x-[2px]'>
                <span className='text-lg md:text-xl font-semibold text-white leading-5 md:leading-[26px]'>{item.data}</span>
                {item.ticker && (
                  <>
                    <span className='text-white text-lg md:text-xl leading-5 md:leading-[26px]'>{item.ticker}</span>
                    <img alt='' className='ml-2 w-[18px] h-[18px] md:w-6 md:h-6' src={`https://cdn.thena.fi/assets/${item.ticker}.png`} />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className='py-[30px] my-[30px] border-y border-[#44476A]'>
        <p className='text-lg md:text-[22px] leading-[22px] md:leading-[27px] text-white font-semibold font-figtree'>Prize Distribution</p>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-x-7 gap-y-5 md:gap-y-[23px]'>
          <div className='mt-[17px]'>
            <div className='flex items-center space-x-1 text-base md:text-[17px] text-lightGray leading-5 font-figtree'>
              <p className='font-figtree'>Host Prize:</p>
              <span>{`${(data.prize.ownerFee / 1000) * 100}%`}</span>
            </div>
            <div className='flex items-center w-full'>
              <span className='text-lg md:text-xl font-semibold text-white leading-5 md:leading-[26px]'>
                {formatNumber(fromWei(data.prize.totalPrize, data.prize.token.decimals).times(data.prize.ownerFee / 1000))}
              </span>
              <span className='text-white text-lg md:text-xl leading-5 md:leading-[26px]'>{data.prize.token.symbol}</span>
              <img alt='' className='ml-0.5 w-[18px] h-[18px] md:w-6 md:h-6' src={`https://cdn.thena.fi/assets/${data.prize.token.symbol}.png`} />
            </div>
          </div>

          {prizeDistribution.map((item, idx) => {
            return (
              <div key={idx + 'prize'} className='mt-[17px]'>
                <div className='flex items-center space-x-1 text-[17px] text-lightGray leading-5 '>
                  <p>{`${idx + 1}${ordinals(idx + 1)} Place`}</p>
                  <span>{`(${item.percenrage})`}</span>
                  {/* {item.key === 'Host' && <img alt='' src='./images/swap/question-mark.png' />} */}
                </div>
                <div className='flex items-center w-full space-x-[2px]'>
                  <span className='text-lg md:text-xl font-semibold text-white leading-5 md:leading-[26px]'>{item.data}</span>
                  <span className='text-white text-lg md:text-xl leading-5 md:leading-[26px]'>{data.prize.token.symbol}</span>
                  <img alt='' className='ml-0.5 w-[18px] h-[18px] md:w-6 md:h-6' src={`https://cdn.thena.fi/assets/${data.prize.token.symbol}.png`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='pb-[30px] border-b border-[#44476A]'>
        <div className='flex items-center justify-between'>
          <LabelTooltip
            textClass='text-lg md:text-[22px] leading-[22px] md:leading-[27px] text-lightGray  font-figtree'
            tooltipID='description'
            label={`Tradable Tokens (${tradableTokens.length})`}
            tooltipDescription='This list contains all the tokens that you can trade that will count towards this trading competition.'
          />
          <div className='max-w-[222px] w-full md:block hidden'>
            <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search' full />
          </div>
        </div>
        <div className='mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-2.5 md:gap-y-[15px] gap-x-2.5 md:gap-x-[13px] overflow-y-scroll max-h-[245px]'>
          {filteredTokens.map((item) => {
            return (
              <div className='py-2 md:py-3 px-2.5 bg-white bg-opacity-[0.04] rounded-xl flex items-start space-x-1.5' key={`trade-${item.symbol}`}>
                <img alt='logo' src={item.logoURI} className='w-5 h-5 md:w-6 md:h-6 rounded-full' />
                <div>
                  <p className='text-[15px] md:text-[17px] text-white font-figtree font-semibold leading-[18px] md:leading-5'>{item.symbol}</p>
                  <span className='text-[13px] text-secondary leading-4'>{item.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='mt-6 md:mt-[30px] '>
        <p className='text-[15px] md:text-[22px] leading-4 md:leading-[27px] text-lightGray font-semibold font-figtree'>Description</p>
        <div dangerouslySetInnerHTML={{ __html: data.description }} className='mt-1.5 text-white' id='description-data' />
      </div>
    </div>
  )
}

export default Home
