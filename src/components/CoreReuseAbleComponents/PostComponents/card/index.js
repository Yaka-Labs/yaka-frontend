import React, { useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import Picker from '@emoji-mart/react'
import mainData from '@emoji-mart/data'
import { v4 as uuidv4 } from 'uuid'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addPostData } from 'state/application/actions'
import Comments from './comments'

const Index = ({ setPosts, allPosts, children, userProfile, home, data, idx, param }) => {
  const [options, setOptions] = useState(false)
  const [share, setShare] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // states for comments
  const [sortComments, setSortComments] = useState('Top Comments')
  const [userReply, setUserReply] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [image, setImage] = useState('')
  const [like, setLike] = useState(false)
  const inputRef = useRef()
  const [bookmark, setBookMark] = useState(false)
  const [enableComments, setEnableComments] = useState(false)

  // setting emojis inside input based on cursor position
  const setReplyEmojis = (emoji) => {
    if (inputRef) {
      const cursorPosition = inputRef.current?.selectionStart || 0
      const text = userReply.slice(0, cursorPosition) + emoji.native + userReply.slice(cursorPosition)
      setUserReply(text)
      const newCursorPosition = cursorPosition + emoji.native.length
      setTimeout(() => {
        inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition)
      }, 10)
    }
  }

  let dup = structuredClone(allPosts)
  const index = dup.findIndex((item) => item.id === data.id)
  // submit comment
  const postComment = () => {
    if (userReply && !showEmojis) {
      let commentObj = {
        commentId: uuidv4(),
        comment: userReply,
        commentImage: image && URL?.createObjectURL(image),
        timePassed: '1 min ago',
        userName: data.userName,
        userImage: data.userImage,
        likes: 0,
        replies: [],
      }
      dup[index].comments.push(commentObj)
      setPosts(dup)
      setUserReply('')
      setImage('')
    }
  }

  const handleLikes = (bol) => {
    let dup = structuredClone(allPosts)
    dup[index].likes = bol ? dup[index].likes - 1 : dup[index].likes + 1
    setPosts(dup)
  }

  return (
    <>
      <div
        onClick={() => {
          dispatch(addPostData(data))
          navigate(`/core/home/${data.id}`)
        }}
        className={` ${home ? 'first-of-type:mt-0  mt-5' : 'mt-5'}  py-4 rounded-[5px] bg-[#101645] w-full cursor-pointer `}
      >
        <div className='w-full relative px-5'>
          {data.repostedUserName && (
            <div className='flex items-center space-x-2 pb-4 border-b border-[#44476A] mb-4'>
              <p className='text-white   leading-5'>
                <span className='hover:text-green cursor-pointer'>{data.repostedUserName} </span>reposted
              </p>
              <span className=' text-secondary text-[13px] leading-4'>{data.repsotedTime}</span>
            </div>
          )}
          <div className='flex items-center justify-between relative'>
            <div className={`flex items-center ${param ? 'space-x-5' : ''}`}>
              {param && (
                <Link
                  to='/core/home'
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch(addPostData(null))
                  }}
                >
                  <img alt='' src='/images/swap/back-arrow.svg' />
                </Link>
              )}
              <div className='flex items-center space-x-2'>
                <Link
                  className='flex items-center space-x-2 group'
                  to={`/core/profile/${idx}/activity`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <img alt='' src={data.userImage} className='w-10 h-10 rounded-full' />
                  <p className='text-white text-[17px] group-hover:text-green transition-all duration-200 ease-in-out font-figtree leading-5 font-medium'>
                    {data.userName}
                  </p>
                </Link>

                <span className='text-secondary text-sm leading-4'>{data.timePassed}</span>
              </div>
            </div>
            <button
              className='p-2'
              onClick={(e) => {
                e.stopPropagation()
                setOptions(!options)
              }}
            >
              <img alt='' src='/images/core/options.svg' />
            </button>
          </div>
          {!userProfile ? (
            <OutsideClickHandler onOutsideClick={() => setOptions(false)}>
              {options && (
                <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] -right-4 top-20 flex flex-col'>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-[0.2rem] w-full'>
                    Follow John Doe
                  </div>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px]  w-full'>
                    Copy Link to Post
                  </div>
                </div>
              )}
            </OutsideClickHandler>
          ) : (
            <OutsideClickHandler onOutsideClick={() => setOptions(false)}>
              {options && (
                <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] -right-4 top-7 flex flex-col'>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-[0.2rem] w-full'>
                    Delete Copy
                  </div>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px]  w-full'>Link to Post</div>
                </div>
              )}
            </OutsideClickHandler>
          )}
        </div>
        {children}
        <div className='flex items-center justify-between px-5'>
          <div className='flex items-center space-x-[26px] relative pr-[154px]'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLike(!like)
                handleLikes(like)
              }}
              className='flex items-center space-x-[5px]'
            >
              <img alt='' src={like ? '/images/core/like-active.svg' : '/images/core/like.svg'} />
              <p className='text-[15px] text-lightGray'>{data.likes ? data.likes : ''}</p>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEnableComments(!enableComments)
              }}
              className='flex items-center space-x-[5px]'
            >
              <img alt='' src='/images/core/comment.svg' />
              <p className='text-[15px] text-lightGray'>{data.comments.length ? data.comments.length : ''}</p>
            </button>
            <button
              onClick={(e) => {
                setShare(!share)
                e.stopPropagation()
              }}
            >
              <img alt='' src='/images/core/share-small.svg' />
            </button>
            <OutsideClickHandler onOutsideClick={() => setShare(false)}>
              {share && (
                <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] right-0 top-6 flex flex-col'>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-[0.2rem] w-full'>
                    Share on X
                  </div>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-[0.2rem] w-full'>
                    Share on Facebook
                  </div>
                  <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-[0.2rem] w-full'>
                    Share on Group
                  </div>
                  <div className='mt-2.5 pt-2.5 border-t border-white border-opacity-[0.31]'>
                    <button className='text-white leading-[27px] text-[15px] hover:opacity-70 transition-all duration-150 ease-in-out'>Copy Link</button>
                  </div>
                </div>
              )}
            </OutsideClickHandler>
          </div>
          <button
            onClick={(e) => {
              setBookMark(!bookmark)
              e.stopPropagation()
            }}
          >
            <img alt='' src={bookmark ? '/images/core/bookmark.svg' : '/images/core/bookmarks.svg'} />
          </button>
        </div>
      </div>

      {/* comments section */}
      {(enableComments || data.comments.find((item) => item.userComment)) && (
        <div className='px-5 py-4 bg-[#101645]'>
          <div className='border-y border-darkGray'>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                postComment()
              }}
            >
              <div className='flex items-center space-x-2.5'>
                <img alt='' src={data.userImage} className='w-9 h-9 rounded-full' />
                <input
                  onChange={(e) => {
                    setUserReply(e.target.value)
                  }}
                  ref={inputRef}
                  value={userReply}
                  className='  leading-5 placeholder-secondary  py-[26px] focus:outline-none w-full bg-transparent text-white'
                  placeholder='Add a comment…'
                />
              </div>
              {image && <img alt='' className='w-full max-w-[150px] h-full object-cover object-center max-h-[426px] pb-4' src={URL.createObjectURL(image)} />}
            </form>
            <div className='flex items-center justify-between pb-4 pl-[46px]'>
              <div className='flex items-center space-x-2'>
                <button onClick={() => setShowEmojis(!showEmojis)}>
                  <img alt='' src='/images/core/emoticon-icon.svg' />
                </button>
                <button className='relative overflow-hidden'>
                  <img alt='add icon' src='/images/core/add-image.svg' />
                  <input type='file' onChange={(e) => setImage(e.target.files[0])} className='absolute opacity-0 inset-0 w-full h-full' />
                </button>
              </div>
              <button
                onClick={() => postComment()}
                disabled={!userReply}
                className=' disabled:opacity-50 py-[5px] px-4 bg-blue text-base leading-5 rounded-full text-white'
              >
                Post
              </button>
            </div>
            {showEmojis && (
              <div className='absolute z-20'>
                <Picker onClickOutside={() => setShowEmojis(false)} data={mainData} onEmojiSelect={(emoji) => setReplyEmojis(emoji)} />
              </div>
            )}
          </div>

          <div className='flex items-center space-x-3.5 mt-3 relative'>
            <p className='text-[22px]  leading-[27px] font-semibold text-lightGray'>
              <span className='font-figtree'>Comment{data.comments.length > 1 && 's'}</span> <span className='font-medium'>({data.comments.length})</span>
            </p>
            <div className='flex items-center max-w-[240px] bg-[#162052] rounded-[3px]'>
              <button
                onClick={() => {
                  setSortComments('Top Comments')
                }}
                className={`${
                  sortComments === 'Top Comments' ? 'text-white border-[#5E6AA5]' : 'text-lightGray border-transparent'
                } border rounded-[3px]  text-sm leading-4 px-3 py-1.5 `}
              >
                Top Comments
              </button>
              <button
                onClick={() => {
                  setSortComments('Newest First')
                }}
                className={`${
                  sortComments === 'Newest First' ? 'text-white border-[#5E6AA5]' : 'text-lightGray border-transparent'
                } border rounded-[3px]  text-sm leading-4 px-3 py-1.5 `}
              >
                Newest First
              </button>
            </div>
          </div>
          <div className='mt-[18px]'>
            {data.comments.map((item, key) => {
              return (
                <Comments
                  allPosts={allPosts}
                  mainUser={data}
                  setPosts={setPosts}
                  comments={data.comments}
                  idx={item.commentId}
                  item={item}
                  iterationKey={key}
                  key={key}
                />
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default Index
