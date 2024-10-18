import Lottie from 'react-lottie'
import * as animationData from './thena-loading.json'

const LottieThena = ({ height = 175, width = 135 }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <div className='flex items-center min-h-screen justify-center'>
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  )
}

export default LottieThena
