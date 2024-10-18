import './style.scss'
import { useTotalTvl } from '../../state/totaltvl/hooks'

const TotalTvl = () => {
  let tvl = useTotalTvl()
  return (
    <div>
      <div className='py-[6.8px]'>
        <div className='h-[37.4px] px-[10.2px] flex items-center space-x-1 cursor-pointer bg-[#FFFFFF1C] bg-opacity-[0.45] rounded-[6.8px]'>
          <span className='text-[14.45px]'>TVL:&nbsp;${tvl.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  )
}

export default TotalTvl
