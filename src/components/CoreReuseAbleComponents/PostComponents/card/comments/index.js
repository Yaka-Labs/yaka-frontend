import React, { useState, useRef } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import Picker from '@emoji-mart/react'
import mainData from '@emoji-mart/data'
import { v4 as uuidv4 } from 'uuid'
import ImageModal from 'components/ImageModal'
import NestedComments from './nestedComments'

const Index = ({ item, comments, idx, mainUser, allPosts, setPosts, iterationKey }) => {
  const [options, setOptions] = useState(false)
  const [reply, setReplies] = useState()

  // main replies
  const [showEmojis, setShowEmojis] = useState(false)
  const [image, setImage] = useState('')
  const inputRef = useRef()
  const [userReply, setUserReply] = useState('')
  const [outerReply, setOuterReply] = useState()
  const [like, setLike] = useState(false)
  const [mentionedUser, setMentionedUser] = useState('')
  const [imageModal, setImageModal] = useState({
    bol: false,
    img: '',
  })

  const setReplyEmojis = (emoji) => {
    if (inputRef) {
      console.log(inputRef, emoji)
      const cursorPosition = inputRef.current?.children[0].selectionStart || 0
      const text = userReply.slice(0, cursorPosition) + emoji.native + userReply.slice(cursorPosition)
      console.log(text, 'got')
      setUserReply(text)
      const newCursorPosition = cursorPosition + emoji.native.length
      setTimeout(() => {
        inputRef.current?.children[0]?.setSelectionRange(newCursorPosition, newCursorPosition)
      }, 10)
    }
  }

  let dup = structuredClone(allPosts)
  const index = dup.findIndex((item) => item.id === mainUser.id)
  const replyIndex = dup[index].comments.findIndex((item) => item.commentId === idx)
  const postComment = () => {
    let dup = structuredClone(allPosts)
    if (userReply && !showEmojis) {
      let commentObj = {
        commentId: uuidv4(),
        comment: userReply,
        commentImage: image && URL?.createObjectURL(image),
        timePassed: '1 min ago',
        userName: mainUser.userName,
        userImage: mainUser.userImage,
        likes: 0,
      }
      dup[index].comments[replyIndex].replies.push(commentObj)
      setPosts(dup)
      setUserReply('')
      setOuterReply(null)
      setImage('')
    }
  }

  const handleLikes = (bol) => {
    dup[index].comments[replyIndex].likes = bol ? dup[index].comments[replyIndex].likes - 1 : dup[index].comments[replyIndex].likes + 1
    setPosts(dup)
  }

  return (
    <>
      <div className={`relative w-full ${iterationKey > 0 ? 'mt-5' : ''} ${iterationKey !== comments.length - 1 ? 'pb-3.5 border-b border-darkGray' : ''}`}>
        <div className='flex items-start justify-between '>
          <div className='flex items-start space-x-2'>
            <img alt='' src={item.userImage} className='w-10 h-10 rounded-full' />
            <div>
              <div className='flex items-center space-x-1.5'>
                <p className='text-lightGray text-[17px] font-figtree leading-5 font-medium'>{item.userName}</p>
                <span className='text-secondary text-sm leading-4'>{item.timePassed}</span>
              </div>
              <p className='leading-5 text-lightGray mt-0.5'>{item.comment}</p>
              {item.commentImage && (
                <img
                  onClick={() => {
                    setImageModal({
                      bol: true,
                      img: item.commentImage,
                    })
                  }}
                  className='mt-3 w-full max-h-[426px] cursor-pointer'
                  src={item.commentImage}
                  alt=''
                />
              )}
              <div className='flex items-center space-x-3.5 mt-2'>
                <button
                  onClick={() => {
                    setLike(!like)
                    handleLikes(like)
                  }}
                  className='flex items-center space-x-[5px]'
                >
                  <img alt='' src={like ? '/images/core/like-active.svg' : '/images/core/like.svg'} />
                  <p className='text-[15px] text-lightGray'>{item.likes ? item.likes : ''}</p>
                </button>
                <button
                  onClick={() => {
                    setMentionedUser(`@${item.userName} `)
                    outerReply ? setOuterReply() : setOuterReply(idx + 1)
                  }}
                  className='pl-2.5 border-l border-darkGray text-lightGray'
                >
                  Reply
                </button>
                {item.replies.length > 0 && (
                  <div
                    onClick={() => {
                      reply ? setReplies() : setReplies(idx + 1)
                    }}
                    className='flex items-center cursor-pointer space-x-2 text-lightGray relative '
                  >
                    <img
                      alt=''
                      className={`${idx + 1 === reply ? 'rotate-180 ' : ''} transform transition-all duration-200 ease-in-out`}
                      src='/images/core/arrow.svg'
                    />
                    <span>{`${item.replies.length} Replies`}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className='p-2' onClick={() => setOptions(!options)}>
            <img alt='' src='/images/core/options.svg' />
          </button>
        </div>

        {idx + 1 === reply && (
          <div className='w-full mt-5'>
            {item.replies.map((_item) => {
              return (
                <NestedComments
                  setImageModal={setImageModal}
                  userReply={userReply}
                  setUserReply={setUserReply}
                  innerReply={outerReply}
                  setInnerReply={setOuterReply}
                  key={_item.commentId}
                  idx={replyIndex}
                  _item={_item}
                  mainPostId={index}
                  allPosts={allPosts}
                  setPosts={setPosts}
                  nestedReplyId={_item.commentId}
                  mainCommentId={idx}
                  setMentionedUser={setMentionedUser}
                />
              )
            })}
          </div>
        )}
        {idx + 1 === outerReply && (
          <OutsideClickHandler onOutsideClick={() => setOuterReply(null)}>
            <div className='border-t border-darkGray my-5'>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  postComment()
                }}
              >
                <div className='flex items-center space-x-2.5 relative'>
                  <img alt='' src={item.userImage} className='w-9 h-9 rounded-full' />
                  <div className='flex items-center space-x-1'>
                    <span className='leading-5 text-[#C4BEED]'>{mentionedUser}</span>
                    <input
                      onChange={(e) => {
                        setUserReply(e.target.value)
                      }}
                      onKeyDown={(e) => {
                        if (!userReply && (e.key === 'Backspace' || e.key === 'Delete')) {
                          setMentionedUser('')
                        }
                      }}
                      ref={inputRef}
                      value={userReply}
                      className='leading-5 placeholder-secondary py-[26px] focus:outline-none w-full bg-transparent text-white'
                      placeholder={mentionedUser ? '' : 'Add a comment…'}
                    />
                  </div>
                </div>
                {image && (
                  <img
                    alt='comments profile'
                    className='w-full max-w-[150px] h-full object-cover object-center max-h-[426px] pb-4'
                    src={URL.createObjectURL(image)}
                  />
                )}
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
                  onClick={() => {
                    postComment()
                  }}
                  disabled={!userReply}
                  className=' disabled:opacity-50 py-[5px] px-4 bg-blue text-base leading-5 rounded-full text-white'
                >
                  Reply
                </button>
              </div>
              {showEmojis && (
                <div className='absolute z-20'>
                  <Picker onClickOutside={() => setShowEmojis(false)} data={mainData} onEmojiSelect={(emoji) => setReplyEmojis(emoji)} />
                </div>
              )}
            </div>
          </OutsideClickHandler>
        )}
        <OutsideClickHandler onOutsideClick={() => setOptions(false)}>
          {options && (
            <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] -right-4 top-7 flex flex-col'>
              <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                Follow {item.userName}
              </div>
              <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px]  w-full'>Send Crypto</div>
            </div>
          )}
        </OutsideClickHandler>
      </div>
      <ImageModal
        modal={imageModal.bol}
        closeModel={() => {
          setImageModal({
            bol: false,
            img: null,
          })
        }}
        imgSrc={imageModal.img}
      />
    </>
  )
}

export default Index
