import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const Index = ({ _item, setInnerReply, idx, innerReply, mainPostId, allPosts, setPosts, nestedReplyId, mainCommentId, setMentionedUser, setImageModal }) => {
  const [like, setLike] = useState(false)
  const [options, setOptions] = useState(false)
  const handleLikes = (bol) => {
    let dup = structuredClone(allPosts)
    const replyIndex = dup[mainPostId].comments[idx].replies.findIndex((item) => item.commentId === nestedReplyId)
    const ref = dup[mainPostId].comments[idx].replies[replyIndex]
    ref.likes = bol ? ref.likes - 1 : ref.likes + 1
    setPosts(dup)
  }
  return (
    <div className='pb-5 pl-12 relative'>
      <div className='flex items-start justify-between'>
        <div className='flex items-start space-x-2'>
          <img alt='' src={_item.userImage} className='w-9 h-9 rounded-full' />
          <div>
            <div className='flex items-center space-x-1.5'>
              <p className='text-lightGray text-[17px] font-figtree leading-5 font-medium'>{_item.userName}</p>
              <span className='text-secondary text-sm leading-4'>{_item.timePassed}</span>
            </div>
            <p className='leading-5 text-lightGray mt-0.5'>{_item.comment}</p>
            {!!_item.commentImage && (
              <img
                className='mt-3 w-full max-h-[426px] cursor-pointer'
                onClick={() => {
                  setImageModal({
                    bol: true,
                    img: _item.commentImage,
                  })
                }}
                src={_item.commentImage}
                alt=''
              />
            )}
          </div>
        </div>
        <button className='p-2' onClick={() => setOptions(!options)}>
          <img alt='' src='/images/core/options.svg' />
        </button>
      </div>
      <div className='flex items-center space-x-3.5 mt-3 pl-11'>
        <button
          onClick={() => {
            setLike(!like)
            handleLikes(like)
          }}
          className='flex items-center space-x-[5px]'
        >
          <img alt='' src={like ? '/images/core/like-active.svg' : '/images/core/like.svg'} />
          {!!_item.likes && <p className='text-[15px] text-lightGray'>{_item.likes ? _item.likes : ''}</p>}
        </button>
        <button
          onClick={() => {
            setMentionedUser(`@${_item.userName} `)
            innerReply ? setInnerReply() : setInnerReply(mainCommentId + 1)
          }}
          className='pl-2.5 border-l border-darkGray text-lightGray'
        >
          Reply
        </button>
      </div>
      <OutsideClickHandler onOutsideClick={() => setOptions(false)}>
        {options && (
          <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] -right-4 top-7 flex flex-col'>
            <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
              Follow {_item.userName}
            </div>
            <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px]  w-full'>Send Crypto</div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  )
}

export default Index
