import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useWeb3React } from '@web3-react/core'
import TransparentButton from 'components/Buttons/transparentButton'
import Modal from 'components/Modal'
import SearchTokenPopup from 'components/SearchTokenPopup'
import StyledButton from 'components/Buttons/styledButton'
import Activity from 'components/CoreReuseAbleComponents/PostComponents/componentsMapper'
import { useWalletModal } from 'state/settings/hooks'
import { squidClient } from 'apollo/client'
import { USER_BY_ID } from 'apollo/coreQueries'
import { checkIfZeroAfterDecimal, numFormater, sliceAddress } from 'utils'
import { customNotify } from 'utils/notify'
import NFTS from './nfts'
import Achievements from './achievements'
import ThenaStats from './thenaStats'

const nftsData = [
  {
    img: '/images/profile/nfts/1.png',
    userName: 'Thenian #1036',
    price: '3.55 BNB',
  },
  {
    img: '/images/profile/nfts/2.png',
    userName: 'Thenian #1036',
    price: '3.55 BNB',
  },
  {
    img: '/images/profile/nfts/3.png',
    userName: 'Thenian #1036',
  },
  {
    img: '/images/profile/nfts/4.png',
    userName: 'Thenian #1036',
    price: '3.55 BNB',
  },
  {
    userName: 'Thenian #1036',
    price: '3.55 BNB',
  },
  {
    img: '/images/profile/nfts/1.png',
    userName: 'Thenian #1036',
    price: '3.55 BNB',
  },
  {
    img: '/images/profile/nfts/1.png',
    userName: 'Thenian #1036',
    price: '3.55 BNB',
  },
]
const tabs = [
  {
    name: 'ACTIVITY',
    route: 'activity',
  },
  { name: 'THENA STATS', route: 'thena-stats' },
  { name: 'ACHIEVEMENTS', route: 'achievements' },
  { name: 'NFTs', route: 'nfts' },
]
const paragraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum rutrum a in tortor.
  Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet, consectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh quis 
   que suscipit nibh quis. Lorem ipsum dolor sit que suscipit nibh quis. Lorem ipsum d m ipsum dolor consecteur
   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Pellentesque in augue sit amet justo interdum rutrum a in tortor. Pellentesque suscipit nibh quis. Lorem ipsum dolor sit amet, consectetur
  adipiamet justo interdum rutrum a in tortosque suscipit nibh quis que suscipit nibh quis. Lorem ipsum dolor sit que suscipit nibh quis. Lorem
  ipsum d m ipsum dolor consecteur nibh quis. Lorem ipsum dolor sit amet, consectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh
  quis que susc sum dolor sit amet, consectetur adipiscin.`
const thenians = [
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: true,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: false,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: true,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: false,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: false,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: true,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: false,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: false,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: false,
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
    following: true,
  },
]
const groups = [
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
  },
  {
    img: '/images/core/p3.png',
    name: 'Theseus',
    members: '1.1k',
  },
]
const OtherThenians = [
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Theseus',
    img: '/images/profile/1.png',
    badge: '/images/profile/b1.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Xermes',
    img: '/images/profile/2.png',
    badge: '/images/profile/b2.png',
    address: '0x8f4f····4f24',
    balance: '93,168 THE',
    followers: '1871',
    rank: '23',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'John Doe',
    img: '/images/profile/1.png',
    badge: '/images/profile/b3.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2710',
    rank: '12',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
  {
    name: 'Lara Thompson',
    img: '/images/profile/1.png',
    badge: '/images/profile/b4.png',
    address: '0x8f4f····4f24',
    balance: '153,719 THE',
    followers: '2871',
    rank: '10',
    description:
      'Hi! My name is Theseus and lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…',
  },
]

const Profile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [tabRoute, setTabRoute] = useState()
  const [share, setShare] = useState(false)

  const [userProfile, setUserProfile] = useState(null)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const [arrowDown, setArrowDown] = useState(false)
  const [userData, setUserData] = useState()

  useEffect(() => {
    if (location.search === '?user' || location.search.split('/')[0] === '?user') {
      setUserProfile(true)
      setTabRoute(location.search.split('/')[1])
    } else {
      setUserProfile(false)
      fetchUserData(location.pathname.split('/')[3])
      setTabRoute(location.pathname.split('/')[4])
    }
  }, [location])

  const [truncate, setTruncate] = useState(200)
  const stringTruncate = (str, length) => {
    var dots = str.length > length ? '...' : str
    return str.substring(0, length) + dots
  }

  const [posts, setPosts] = useState([
    {
      id: 0,
      userName: 'Tomas.thena',
      userImage: '/images/core/p3.png',
      repostedUserName: 'Johndoe.thena',
      repsotedTime: '3 min ago',
      likes: 0,
      comments: [
        {
          commentId: 211,
          timePassed: '22 min ago',
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          userName: 'Tomas.thena',
          userComment: true,
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '2 min ago',
      type: 'info',
      svg: '/images/core/add-liquidity.svg',
      info: 'Larathompson.thena has removed 10 USDT & 10 USDC from the USDT-USDC stable liquidity pool.',
    },
    {
      id: 111,
      userName: 'Tomas.thena',
      userImage: '/images/core/p3.png',
      likes: 0,
      comments: [],
      timePassed: '2 min ago',
      type: 'nft',
      nftImage: '/images/profile/nfts/thenft.png',
      title: 'Thenian #518',
      info: "<p>Price on OpenSea <span id='price'>0.1 BNB</span> $23.05</p>",
    },
    {
      id: 1,
      userName: 'Xermes.thena',
      userImage: '/images/core/p3.png',
      likes: 3,
      comments: [
        {
          commentId: 2,
          timePassed: '22 min ago',
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          userName: 'Xermes.thena',
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '2 min ago',
      type: 'badge',
      info: 'Rising Star Achievement Completed!',
      reason: 'Reach a trading volume of $25,000 USD.',
      icon: 'https://cdn.thena.fi/assets/DOGE.png',
    },
    {
      id: 2,
      userName: 'Larathomspon.thena',
      userImage: '/images/core/p3.png',
      likes: 4,
      comments: [
        {
          commentId: 4,
          timePassed: '2 min ago',
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '',
          userName: 'Xermes',
          userImage: '/images/core/p1.png',
          likes: 8,
          replies: [
            {
              commentId: 3,
              userName: 'Xermes.thena',
              userImage: '/images/core/p2.png',
              comment: 'Lorem ipsum dolor sit amet.',
              commentImage: '/images/core/cover.png',
              timePassed: '2 min ago',
              likes: 8,
            },
            {
              commentId: 7,
              userName: 'Xermes.thena',
              userImage: '/images/core/p1.png',
              comment: 'Lorem ipsum dolor sit amet.',
              commentImage: '/images/core/cover.png',
              timePassed: '2 min ago',
              likes: 8,
            },
          ],
        },
        {
          commentId: uuidv4(),
          timePassed: '22 min ago',
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          userName: 'Larathomspon.thena',
          userComment: true,
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '4 min ago',
      type: 'competitionpost',
      tradingType: 'PERPETUAL',
      info: "<p>Xermes.thena created trading competition <a href='/core/competition/trading-competition-1'>Trading Competition 4.</a></p>",
      title: 'Ankr Discord AMA',
      time: 'Fri, Jan 27, 2023, 1 PM UTC',
      members: 246,
      money: '$9,460',
      free: true,
      postImg: '/images/core/cover.png',
    },
    {
      id: 3,
      userName: 'Larathomspon.thena',
      userImage: '/images/core/p3.png',
      likes: 10,
      comments: [
        {
          commentId: 6,
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '2 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p1.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '2 min ago',
      type: 'info',
      svg: '/images/core/add-liquidity.svg',
      info: 'Larathompson.thena has removed 10 USDT & 10 USDC from the USDT-USDC stable liquidity pool.',
    },
    {
      id: 4,
      userName: 'Larathomspon.thena',
      userImage: '/images/core/p3.png',
      likes: 11,
      comments: [
        {
          commentId: 8,
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '2 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [
            {
              commentId: 9,
              userName: 'Xermes.thena',
              userImage: '/images/core/p3.png',
              comment: 'Lorem.',
              commentImage: '/images/core/cover.png',
              timePassed: '2 min ago',
              likes: 8,
            },
          ],
        },
      ],
      timePassed: '20 min ago',
      type: 'info',
      svg: '/images/core/bribe.svg',
      info: 'Tomas.thena bribed USDC-USDT stable with 100 USDC, 50 BNB.',
    },
    {
      id: 5,
      userName: 'Larathomspon.thena',
      userImage: '/images/core/p3.png',
      likes: 12,
      comments: [
        {
          commentId: 10,
          comment: 'Lorem  dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '1 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '30 min ago',
      type: 'competitionpost',
      tradingType: 'SPOT',
      info: "<p>Xermes.thena created trading competition <a href='/core/competition/trading-competition-1'>Trading Competition 4.</a></p>",
      title: 'Ankr Discord AMA',
      time: 'Fri, Jan 27, 2023, 1 PM UTC',
      members: 246,
      money: '$9,460',
      free: false,
      fee: 200,
      postImg: '/images/core/cover.png',
    },
    {
      id: 6,
      userName: 'Larathomspon.thena',
      userImage: '/images/core/p3.png',
      likes: 6,
      comments: [
        {
          commentId: 12,
          comment: 'ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '1 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
        {
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '2 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '10 min ago',
      type: 'info',
      svg: '/images/core/pool.svg',
      info: 'Tomas.thena has created a new Liquidity Bootstrapping Pool myToken-WBNB.',
    },
    {
      id: 7,
      userName: 'Larathomspon.thena',
      userImage: '/images/core/p3.png',
      likes: 2,
      comments: [
        {
          commentId: 14,
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '2 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p3.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '10 min ago',
      type: 'info',
      svg: '/images/core/vote.svg',
      info: 'Tomas.thena has voted for USDT-WBNB, ETH-WBNB with weights 30%, 70%.',
    },
    {
      id: 8,
      userName: 'Tomas.thena',
      userImage: '/images/core/p3.png',
      likes: 12,
      comments: [
        {
          commentId: 16,
          comment: 'Lorem ipsum dolor.',
          commentImage: '',
          timePassed: '2 min ago',
          userName: 'Xermes.thena',
          userImage: '/images/core/p2.png',
          likes: 8,
          replies: [],
        },
      ],
      timePassed: '40 min ago',
      type: 'info',
      svg: '/images/core/swap.svg',
      info: 'Larathompson.thena has swapped 1,000 BUSD for 320 THE.',
    },
    {
      id: 9,
      userName: 'Xermes.thena',
      userImage: '/images/core/p3.png',
      likes: 10,
      comments: [
        {
          commentId: 18,
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '',
          timePassed: '12 min ago',
          userName: 'test.thena',
          userImage: '/images/core/p2.png',
          likes: 4,
          replies: [
            {
              commentId: 11,
              commentImage: '',
              timePassed: '12 min ago',
              userName: 'Xermes.thena',
              userImage: '/images/core/p2.png',
              comment: 'example 1.',
              likes: 2,
            },
            {
              commentId: 13,
              commentImage: '',
              timePassed: '12 min ago',
              userName: 'Xermes.thena',
              userImage: '/images/core/p1.png',
              comment: 'example 2.',
              likes: 1,
            },
          ],
        },

        {
          commentId: 20,
          comment: 'Lorem ipsum dolor sit amet.',
          commentImage: '/images/core/cover.png',
          timePassed: '12 min ago',
          userName: 'test.thena',
          userImage: '/images/core/p2.png',
          likes: 4,
          replies: [
            {
              commentId: 15,
              commentImage: '',
              timePassed: '12 min ago',
              userName: 'Xermes.thena',
              userImage: '/images/core/p2.png',
              comment: ' 1.',
              likes: 2,
            },
            {
              commentId: 17,
              commentImage: '/images/core/cover.png',
              timePassed: '12 min ago',
              userName: 'Xermes.thena',
              userImage: '/images/core/p1.png',
              comment: ' 2.',
              likes: 1,
            },
          ],
        },
      ],
      timePassed: '13 min ago',
      type: 'eventpost',
      info: '<p>Larathomspon.thena attends event <a href=\'https://discord.gg/yaka-finance/\' target="__blank">Ankr Discord AMA.</a></p>',
      title: 'Ankr Discord AMA',
      time: 'Fri, Jan 27, 2023, 1 PM UTC',
      members: 246,
      money: '$9,460',
      free: false,
      fee: 200,
      duration: '1h 20m',
      location: 'Ankr Discord',
      postImg: '/images/core/cover.png',
      locationLink: 'https://discord.gg/yaka-finance/',
    },
  ])

  const renderTabs = (tab) => {
    switch (tab) {
      case 'activity':
        return <Activity posts={posts} userProfile={userProfile} setPosts={setPosts} />
      case 'thena-stats':
        return <ThenaStats earnings={earnings} />
      case 'achievements':
        return <Achievements />
      case 'nfts':
        return <NFTS nftsData={nftsData} />
      default:
    }
  }

  const [cryptoModal, setCryptoModal] = useState(false)
  const [tokenPopup, setTokenPopup] = useState(false)
  const [following, setFollowing] = useState(false)
  const [followers, setFollowers] = useState(false)
  // const [removeFollower, setRemoveFollower] = useState()
  const [switchGroups, setSwitchGroups] = useState(false)

  const [formData, setFormData] = useState({
    token: 'BUSD',
    value: '',
    message: '',
  })

  const checkProfile = () => {
    if (userProfile) {
      if (userProfile && account) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  const [earnings, setEarnings] = useState(false)

  const navigateRoutes = (item) => {
    userProfile ? navigate(`/core/profile?user/${item.route}`) : navigate(`/core/profile/${location.pathname.split('/')[3]}/${item.route}`)
  }

  // Fetch user data
  const fetchUserData = (id) => {
    squidClient
      .query({
        query: USER_BY_ID(id),
      })
      .then((res) => {
        setUserData(res.data.userById)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <div className='w-full max-w-[940px] 2xl:max-w-full overflow-hidden'>
        {checkProfile() ? (
          <>
            <div className=' pt-6 rounded-[5px] bg-[#101645] w-full'>
              <div className='w-full  px-5'>
                {!userProfile && (
                  <div className='table mb-5'>
                    <div
                      onClick={() => {
                        navigate(-1)
                      }}
                      className='flex items-center px-4 py-1.5 rounded-full bg-body space-x-2.5 cursor-pointer'
                    >
                      <img alt='' src='/images/swap/back-arrow.svg' />
                      <span className='text-[22px] leading-[25px] text-white font-semibold font-figtree'>Back</span>
                    </div>
                  </div>
                )}
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-start space-x-4 relative'>
                      <img alt='' src='/images/core/p3.png' className='w-[62px] h-[62px] rounded-full' />
                      <div className='flex items-center space-x-2 mt-2'>
                        <div>
                          <div
                            onClick={() => {
                              userProfile && arrowDown ? setArrowDown(false) : setArrowDown(true)
                            }}
                            className='flex items-center cursor-pointer space-x-[5px]'
                          >
                            <p className='text-[22px] leading-[26px] text-white font-figtree font-medium'>{userData && sliceAddress(userData?.id)}</p>
                            {userProfile && (
                              <button className={`${arrowDown ? 'rotate-180' : 'rotate-0'} mt-1 transform transition-all duration-150 ease-in-out`}>
                                <img alt='' src='/images/header/chevron.svg' />
                              </button>
                            )}
                          </div>
                          <div className='flex items-center space-x-1.5 text-[15px] text-secondary'>
                            <span>{userData && sliceAddress(userData?.id)}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(userData?.id)
                                customNotify('Copied!', 'info')
                              }}
                              className='w-full'
                            >
                              <img alt='' src='/images/core/copy-address.svg' />
                            </button>
                          </div>
                        </div>
                        <img alt='' src='/images/profile/badge.png' />
                        <OutsideClickHandler onOutsideClick={() => setArrowDown(false)}>
                          {arrowDown && userProfile && (
                            <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] left-[70px] top-11 flex flex-col'>
                              <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                                John Doe
                              </div>
                              <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                                Thenian
                              </div>
                              <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                                Loremipsumdolorus123
                              </div>
                              <div className='mt-2.5 pt-2.5 border-t border-white border-opacity-[0.31]'>
                                <button className='text-white leading-[27px] text-[15px] hover:opacity-70 transition-all duration-150 ease-in-out'>
                                  Mint New
                                </button>
                              </div>
                            </div>
                          )}
                        </OutsideClickHandler>
                      </div>
                    </div>
                    <div className='flex  space-x-3 leading-[19px] text-[15px] text-secondary mt-1 ml-[78px]'>
                      <span>2:35 AM (2 h ahead)</span>
                      <div className='w-px bg-[#757384]' />
                      <div className='flex items-center space-x-1.5'>
                        <img alt='' src='/images/core/mini-calendar.svg' />
                        <span>Joined {moment(userData?.firstInteractAt).format('ll')}</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2.5 relative'>
                    {userProfile ? (
                      <div className='flex items-center space-x-2.5'>
                        <button
                          onClick={() => {
                            setEarnings(!earnings)
                          }}
                          className='flex items-center space-x-1'
                        >
                          <img alt='' src={`/images/profile/${earnings ? 'show-earnings.svg' : 'hide-earnings.svg'}`} />
                          <p className='text-base text-lightGray leading-5'>{`${earnings ? 'Show' : 'Hide'} Earnings`}</p>
                        </button>
                        <TransparentButton onClickHandler={() => {}} content='Edit Profile' className='px-[22px] py-2' />
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2.5'>
                        <TransparentButton onClickHandler={() => {}} content='Follow' className='px-[22px] py-2' />
                        <TransparentButton onClickHandler={() => setCryptoModal(true)} content='Send Crypto' className='px-[22px] py-2' />
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setShare(!share)
                      }}
                      className='p-1.5 flex flex-col items-center justify-center rounded-[3px] border-[2px] border-[#0000AF]'
                    >
                      <img alt='' src='/images/core/share-small.svg' />
                    </button>
                    <OutsideClickHandler onOutsideClick={() => setShare(false)}>
                      {share && (
                        <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] right-0 top-[58px] flex flex-col'>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                            Share on X
                          </div>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                            Share on Facebook
                          </div>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                            Share on Group
                          </div>
                          <div className='mt-2.5 pt-2.5 border-t border-white border-opacity-[0.31]'>
                            <button className='text-white leading-[27px] text-[15px] hover:opacity-70 transition-all duration-150 ease-in-out'>
                              Copy Link
                            </button>
                          </div>
                        </div>
                      )}
                    </OutsideClickHandler>
                  </div>
                </div>
                <div className='flex items-center space-x-10 mt-5'>
                  <p className='text-lightGray'>
                    <span className=' text-[17px] font-figtree leading-5'>Rank</span>
                    &nbsp;
                    <span className='text-xl leading-6  font-semibold'>167</span>
                  </p>
                  <div className='text-lightGray flex items-center space-x-1.5'>
                    <span className=' text-[17px] font-figtree leading-5'>Balance</span>
                    {earnings ? (
                      <div className='w-24 h-6 bg-white bg-opacity-[0.04]' />
                    ) : (
                      <span className='text-xl leading-6  font-semibold'> {userData && checkIfZeroAfterDecimal(numFormater(userData.balance)) + ' YAKA'} </span>
                    )}
                  </div>
                  <p onClick={() => setFollowers(true)} className='text-lightGray cursor-pointer'>
                    <span className=' text-[17px] font-figtree leading-5'>Followers</span>
                    &nbsp;
                    <span className='text-xl leading-6  font-semibold'>210</span>
                  </p>

                  <p className='text-lightGray cursor-pointer' onClick={() => setFollowing(true)}>
                    <span className=' text-[17px] font-figtree leading-5'>Following</span>
                    &nbsp;
                    <span className='text-xl leading-6  font-semibold'>132</span>
                  </p>
                </div>
                <div className='flex items-center space-x-3.5 mt-5'>
                  <button className='bg-white bg-opacity-[0.05] py-1.5 px-3 rounded-full flex items-center space-x-1.5 text-secondary hover:text-green transition-all duration-150 ease-in-out'>
                    <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} viewBox='0 0 14 14'>
                      <g id='website' transform='translate(-136 -904)'>
                        <rect id='Rectangle_13532' data-name='Rectangle 13532' width={14} height={14} transform='translate(136 904)' fill='none' />
                        <g id='internet' transform='translate(136 904)'>
                          <path
                            id='Path_37264'
                            data-name='Path 37264'
                            d='M3.75,10.75a7,7,0,1,1,7,7A7,7,0,0,1,3.75,10.75Zm7-5.923a5.923,5.923,0,1,0,5.923,5.923A5.924,5.924,0,0,0,10.75,4.827Z'
                            transform='translate(-3.75 -3.75)'
                            fill='currentColor'
                            fillRule='evenodd'
                          />
                          <path
                            id='Path_37265'
                            data-name='Path 37265'
                            d='M14.279,4.406a2.535,2.535,0,0,1,3.4,0,4.887,4.887,0,0,1,1.181,1.556,10.815,10.815,0,0,1,1.014,4.788,10.815,10.815,0,0,1-1.014,4.787,4.887,4.887,0,0,1-1.181,1.556,2.535,2.535,0,0,1-3.4,0A4.887,4.887,0,0,1,13.1,15.537a10.815,10.815,0,0,1-1.014-4.787A10.815,10.815,0,0,1,13.1,5.962,4.887,4.887,0,0,1,14.279,4.406ZM14.222,6.4a9.868,9.868,0,0,0-.908,4.35,9.868,9.868,0,0,0,.908,4.35,3.824,3.824,0,0,0,.905,1.213,1.193,1.193,0,0,0,1.707,0,3.824,3.824,0,0,0,.905-1.213,9.868,9.868,0,0,0,.908-4.35,9.868,9.868,0,0,0-.908-4.35,3.824,3.824,0,0,0-.905-1.213,1.193,1.193,0,0,0-1.707,0A3.824,3.824,0,0,0,14.222,6.4Z'
                            transform='translate(-8.981 -3.75)'
                            fill='currentColor'
                            fillRule='evenodd'
                          />
                          <path
                            id='Path_37266'
                            data-name='Path 37266'
                            d='M17.766,19.281a31.052,31.052,0,0,1-12.993,0l.194-1.21a30.126,30.126,0,0,0,12.605,0Z'
                            transform='translate(-4.269 -12.02)'
                            fill='currentColor'
                            fillRule='evenodd'
                          />
                        </g>
                      </g>
                    </svg>
                    <span className='text-[15px] font-medium leading-5'>Website</span>
                  </button>
                  <button className='bg-white bg-opacity-[0.05] py-1.5 px-3 rounded-full flex items-center space-x-1.5 text-secondary hover:text-green transition-all duration-150 ease-in-out'>
                    <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} viewBox='0 0 14 14'>
                      <g id='twitter' transform='translate(-255 -412)'>
                        <rect id='Rectangle_13532' data-name='Rectangle 13532' width={14} height={14} transform='translate(255 412)' fill='none' />
                        <path
                          id='Twitter-2'
                          data-name='Twitter'
                          d='M-10203.514,8558.207a5.764,5.764,0,0,1-1.826.715,2.835,2.835,0,0,0-2.1-.932,2.908,2.908,0,0,0-2.871,2.944,2.818,2.818,0,0,0,.074.672,8.08,8.08,0,0,1-5.922-3.078,2.994,2.994,0,0,0-.389,1.483,2.971,2.971,0,0,0,1.277,2.451,2.834,2.834,0,0,1-1.3-.367v.037a2.926,2.926,0,0,0,2.3,2.885,2.681,2.681,0,0,1-.758.1,2.637,2.637,0,0,1-.537-.052,2.882,2.882,0,0,0,2.684,2.044,5.687,5.687,0,0,1-3.57,1.264,5.612,5.612,0,0,1-.684-.041,8,8,0,0,0,4.4,1.322,8.227,8.227,0,0,0,8.172-8.381c0-.128,0-.255-.008-.381a5.878,5.878,0,0,0,1.434-1.526,5.545,5.545,0,0,1-1.648.465A2.941,2.941,0,0,0-10203.514,8558.207Z'
                          transform='translate(10472.129 -8144.824)'
                          fill='currentColor'
                        />
                      </g>
                    </svg>
                    <span className='text-[15px] font-medium leading-5'>Twitter</span>
                  </button>
                </div>
                <p className='mt-3 text-secondary text-base leading-[26px]'>{stringTruncate(paragraph, truncate)}</p>
                <span
                  onClick={() => setTruncate(truncate === paragraph.length ? 200 : paragraph.length)}
                  className='text-green mt-1.5 text-lg leading-5 cursor-pointer'
                >
                  {truncate === paragraph.length ? 'less' : 'more'}
                </span>
              </div>
              <div className='flex items-center w-full mt-[38px]'>
                {tabs.map((item, idx) => {
                  const isActive = userProfile ? item.route === location.search.split('/')[1] : item.route === location.pathname.split('/')[4]
                  const activeClass = isActive ? 'text-white border-b-2 border-green font-semibold' : 'text-secondary font-medium'
                  return (
                    <div
                      onClick={() => {
                        setTabRoute(item.route)
                        navigateRoutes(item, idx)
                      }}
                      className={`text-xl font-figtree pb-2.5 flex items-center justify-center leading-6 cursor-pointer w-1/4 ${activeClass}`}
                      key={idx}
                    >
                      {item.name}
                    </div>
                  )
                })}
              </div>
            </div>
            {renderTabs(tabRoute)}
          </>
        ) : (
          <div className='relative'>
            <div
              style={{ backgroundImage: 'url(/images/profile/space-bg.png)' }}
              className='rounded-[5px]  bg-cover bg-center border border-blue  w-full py-[52px] flex flex-col items-center justify-center text-center relative z-10'
            >
              <p className='text-[27px] leading-8 text-white font-figtree font-semibold'>Connect Your Web3 Wallet</p>
              <p className=' text-secondary leading-[22px] mt-1.5'>Connect your web3 wallet and start connecting with other Thenians.</p>
              <TransparentButton onClickHandler={() => openWalletModal()} content='CONNECT WALLET' className='mt-[15px] px-[25px] py-2.5' isUpper />
            </div>
            <p className='mt-5 mb-2 text-[27px] leading-8 text-white font-figtree font-semibold'>Popular Thenians</p>
            <div className='grid grid-cols-2 gap-5'>
              {OtherThenians.map((item, idx) => {
                return (
                  <Link
                    to={`/core/profile/${idx}/activity`}
                    className='bg-cardBg p-4 rounded-[5px] transition-all duration-200 ease-in-out group hover:shadow-[0px_0px_40px_#0000A8] border-transparent border hover:border-blue'
                    key={idx}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center space-x-2'>
                        <img alt='' src={item.img} className='h-11 w-11' />
                        <div>
                          <p className='text-lg leading-[22px] text-white font-medium font-figtree'>{item.name}</p>
                          <span className='text-[13px] text-secondary leading-[15px] mt-[0.37px]'>{item.address}</span>
                        </div>
                      </div>
                      <img alt='' src={item.badge} className='h-9 w-9' />
                    </div>
                    <div className='flex items-center space-x-9 mt-5'>
                      <div className='text-lightGray'>
                        <p className=' text-[15px] font-figtree leading-[18px]'>Balance</p>
                        <span className='text-[17px] leading-5 font-semibold'>{item.balance}</span>
                      </div>
                      <div className='text-lightGray'>
                        <p className=' text-[15px] font-figtree leading-[18px]'>Followers</p>
                        <span className='text-[17px] leading-5 font-semibold'>{item.followers}</span>
                      </div>
                      <div className='text-lightGray'>
                        <p className=' text-[15px] font-figtree leading-[18px]'>Rank</p>
                        <span className='text-[17px] leading-5 font-semibold'>{item.rank}</span>
                      </div>
                    </div>
                    <p className='mt-3 text-sm leading-5 text-secondary'>{item.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* send crypto modal */}
      <Modal popup={cryptoModal} setPopup={setCryptoModal} title='Send Crypto' width={465.8}>
        <div className='mt-3'>
          <p className='text-base leading-5 text-lightGray mb-1.5'>Send to</p>
          <div className='flex items-start space-x-[9px] relative'>
            <img alt='' src='/images/core/p3.png' className='w-11 h-11 rounded-full' />
            <div>
              <p className='text-xl leading-[26px] text-white font-figtree font-medium'>John Doe</p>
              <span className='text-secondary text-[15px]'>0x8f4f····4f24</span>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='mt-4'>
            <div className='text-lightGray leading-5'>Select Token</div>
            <div
              onClick={() => {
                setTokenPopup(true)
                setFormData({ ...formData, token: 'BUSD' })
              }}
              className='relative cursor-pointer border border-blue w-full  rounded-[3px] mt-2 bg-body  h-[42px] lg:h-14 text-white text-base px-4 flex flex-col items-center justify-center'
            >
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center space-x-1.5'>
                  <img alt='' src='.https://cdn.thena.fi/assets/BUSD.png' className='w-[25px] h-[25px]' />
                  <span className='text-lg text-white font-figtree leading-[22px]'>BUSD</span>
                </div>
                <img alt='' src='/images/swap/dropdown-arrow.png' />
              </div>
            </div>
          </div>
          <div className='w-full mt-5'>
            <div className='flex items-center justify-between text-base leading-5'>
              <div className='text-lightGray leading-5'>Amount</div>
              <div className='text-white'>Balance: 9,999</div>
            </div>
            <div className='relative cursor-pointer border border-blue w-full rounded-[3px] mt-2 bg-body h-[42px] lg:h-[52px] text-white text-base flex flex-col items-center justify-center'>
              <input
                onChange={(e) => {
                  setFormData({ ...formData, value: e.target.value })
                }}
                className='h-full px-4 focus:outline-none w-full bg-transparent text-white placeholder-white'
                value={formData.value}
                type='number'
              />
              <div className='flex items-center space-x-1.5 absolute right-4'>
                <img alt='' src='.https://cdn.thena.fi/assets/BUSD.png' className='w-[25px] h-[25px]' />
                <span className='text-lg text-white font-figtree leading-[22px]'>BUSD</span>
              </div>
            </div>
          </div>
          <div className='mt-5 flex flex-col'>
            <div className='text-lightGray leading-5 w-full'>Message (optional)</div>
            <textarea
              className='border border-blue bg-body resize-none h-[137px] mt-2'
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <div className='flex items-center justify-center space-x-5 mt-6'>
            <TransparentButton content='CANCEL' onClickHandler={() => setCryptoModal(false)} className='px-[52px] py-3' isUpper />
            <StyledButton disabled={!formData.token || !formData.value} content='SEND' className='py-3 px-[62px]' />
          </div>
        </div>
      </Modal>
      {/* followers modal */}
      <Modal className='max-h-[386px] overflow-auto' popup={followers} setPopup={setFollowers} title='Followers' width={465.8}>
        <div className='mt-4'>
          {/* {removeFollower ? (
            <>
              <div className='mt-1.5'>
                <p className='text-base leading-5 text-lightGray mb-1.5'>Are you sure you want to remove this follower?</p>
                <div className='flex items-start space-x-[9px] relative mt-5'>
                  <img alt='' src='/images/core/p3.png' className='w-11 h-11 rounded-full' />
                  <div >
                    <p className='text-xl leading-[26px] text-white font-figtree font-medium'>John Doe</p>
                    <span className='text-secondary text-[15px]'>0x8f4f····4f24</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center space-x-5 mt-6'>
                <TransparentButton
                  content={'REMOVE'}
                  onClickHandler={() => setRemoveFollower()}
                  className='
            relative font-figtree px-[52px] py-3  text-white flex flex-col items-center justify-center text-[17px] tracking-[1.36px] rounded-[3px] transition-all duration-300 ease-in-out'
                />
                <StyledButton
                  onClickHandler={() => setRemoveFollower()}
                  content={'CANCEL'}
                  className='py-3 px-[62px]'
                />
              </div>
            </>
          ) : ( */}
          {thenians.map((item, idx) => {
            return (
              <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                <div className='flex items-center space-x-2.5'>
                  <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                  <div className='flex flex-col space-y-0.5'>
                    <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                    <span className='text-secondary leading-[17px] text-sm'>{item.members} followers</span>
                  </div>
                </div>
                <TransparentButton content={item.following ? 'Unfollow' : 'Follow'} className='px-3 py-1.5' />
              </div>
            )
          })}

          {/* )} */}
        </div>
      </Modal>
      {/* following modal */}
      <Modal className='max-h-[386px] overflow-auto' popup={following} setPopup={setFollowing} title='Following' width={465.8}>
        <div className='flex items-center justify-center space-x-[30px] mt-3'>
          <button
            className={`leading-6 text-xl ${
              !switchGroups ? ' text-white  font-semibold border-green' : ' border-transparent text-[#757384] font-medium'
            } pb-1 border-b-2`}
            onClick={() => setSwitchGroups(false)}
          >
            Thenians
          </button>
          <button
            className={`leading-6 text-xl ${
              switchGroups ? ' text-white  font-semibold border-green' : ' border-transparent text-[#757384] font-medium'
            } pb-1 border-b-2`}
            onClick={() => setSwitchGroups(true)}
          >
            Groups
          </button>
        </div>
        <div className='mt-5 w-full'>
          {!switchGroups
            ? thenians.map((item, idx) => {
                return (
                  <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                    <div className='flex items-center space-x-2.5'>
                      <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                      <div className='flex flex-col space-y-0.5'>
                        <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                        <span className='text-secondary leading-[17px] text-sm'>{item.members} followers</span>
                      </div>
                    </div>
                    <TransparentButton content={item.following ? 'Unfollow' : 'Follow'} onClickHandler={() => {}} className='px-3 py-1.5' />
                  </div>
                )
              })
            : groups.map((item, idx) => {
                return (
                  <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                    <div className='flex items-center space-x-2.5'>
                      <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                      <div className='flex flex-col space-y-0.5'>
                        <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                        <span className='text-secondary leading-[17px] text-sm'>{item.members} members</span>
                      </div>
                    </div>
                    <TransparentButton content={checkProfile() ? 'Join' : 'Leave'} onClickHandler={() => {}} className='px-3 py-1.5' />
                  </div>
                )
              })}
        </div>
      </Modal>

      {tokenPopup && (
        <SearchTokenPopup
          popup={tokenPopup}
          setPopup={setTokenPopup}
          selectedAsset={[]}
          setSelectedAsset={() => {}}
          otherAsset={[]}
          setOtherAsset={() => {}}
          baseAssets={[]}
        />
      )}
    </>
  )
}

export default Profile
