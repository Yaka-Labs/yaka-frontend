import React, { useState, useMemo } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import quillEmoji from 'react-quill-emoji'
import SimpleInput from 'components/Input/simpleInput'
import Label from 'components/TooltipLabelComponent'
import StyledButton from 'components/Buttons/styledButton'
import NativeDropDown from 'components/NativeDropDown'
import timeZones from 'config/timezones/timezones.json'
import Toggle from 'components/Toggle'
import 'react-quill-emoji/dist/quill-emoji.css'
import 'react-quill/dist/quill.snow.css'

const Index = () => {
  const [img, setImg] = useState('')
  const [formData, setFormData] = useState({
    website: '',
    twitterProfile: '',
    aboutYou: '',
    timeZone: '',
    suggest: false,
  })
  const toolbarOption = [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'strike', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['emoji', 'image', 'code-block'],
  ]
  Quill.register(
    {
      'formats/emoji': quillEmoji.EmojiBlot,
      'modules/emoji-toolbar': quillEmoji.ToolbarEmoji,
      'modules/emoji-textarea': quillEmoji.TextAreaEmoji,
      'modules/emoji-shortname': quillEmoji.ShortNameEmoji,
    },
    true,
  )

  const handleOnChange = (e) => {
    e === '<p><br></p>'
      ? setFormData({
          ...formData,
          aboutYou: '',
        })
      : setFormData({
          ...formData,
          aboutYou: e,
        })
  }

  const getValue = (item) => {
    setFormData({
      ...formData,
      timeZone: item,
    })
  }

  const disabled = useMemo(() => {
    return Object.values(formData).every((key, idx) => (idx === 4 ? true : key))
  }, [formData])

  return (
    <div className=' bg-cardBg rounded-[3px] px-5 py-6'>
      <div className='flex items-center space-x-2'>
        <img alt='profile pic' src={img ? URL.createObjectURL(img) : '/images/settings/placeholderProfilePic.svg'} className='w-10 h-10 rounded-full' />
        <div className=' relative'>
          <p className='text-xl font-figtree leading-6 text-white font-medium'>0xCBF6Dbf1522ce32E23f15efb5549352B211F8301</p>
          <button className='relative overflow-hidden'>
            <span className='text-green leading-5 font-medium z-0'>Select profile photo</span>
            <input onChange={(e) => setImg(e.target.files[0])} type='file' className='absolute opacity-0 inset-0 w-full h-full bg-transparent z-10' />
          </button>
        </div>
      </div>
      <div className='w-full gradient-bg p-px rounded-[5px] my-6'>
        <div className='gradient-bg-new py-[18px] px-6 flex items-center justify-between w-full rounded-[5px]'>
          <div className='max-w-[340px] w-full'>
            <p className='text-[22px] font-semibold text-white font-figtree'>Mint THENA ID</p>
            <p className=' text-base text-lightGray leading-5'>Replace your wallet address with a custom Thena ID. You can mint multiple THENA IDs.</p>
          </div>
          <StyledButton className='px-[31px] py-3 w-fit' content='MINT THENA ID' />
        </div>
      </div>
      <div className='w-full flex items-center space-x-5'>
        <div className='w-1/2'>
          <Label label='Your Website Link' />
          <SimpleInput
            typedString={formData.website}
            onChange={(e) => {
              setFormData({
                ...formData,
                website: e.target.value,
              })
            }}
            className='mt-2'
          />
        </div>
        <div className='w-1/2'>
          <Label label='Your Twiter profile link' />
          <SimpleInput
            typedString={formData.twitterProfile}
            onChange={(e) => {
              setFormData({
                ...formData,
                twitterProfile: e.target.value,
              })
            }}
            className='mt-2'
          />
        </div>
      </div>
      <div className='w-full mt-5'>
        <Label label='About You' />
        <ReactQuill
          modules={{
            toolbar: toolbarOption,
            'emoji-toolbar': true,
            'emoji-shortname': true,
          }}
          theme='snow'
          className='bg-body h-full relative text-white mt-2 border border-blue'
          value={formData.aboutYou}
          onChange={handleOnChange}
        />
      </div>
      <div className='w-full mt-5'>
        <Label label='Your Time Zone' />
        <NativeDropDown getValue={getValue} bgColor='bg-body' arr={timeZones.map((item) => item.text)} className='w-full mt-2' />
      </div>
      <div className='w-full mt-5 flex items-center space-x-2.5'>
        <Toggle
          onChange={() => {
            setFormData({
              ...formData,
              suggest: !formData.suggest,
            })
          }}
          small
          checked={formData.suggest}
          toggleId='suggestProfile'
        />
        <p className='text-lightGray text-[16px] whitespace-nowrap'>Suggest my profile to other users</p>
      </div>

      <div className='flex items-center justify-center mt-8'>
        <StyledButton disabled={!disabled} onClickHandler={() => {}} className='px-16 py-[15px] w-fit' content='SAVE' />
      </div>
    </div>
  )
}

export default Index
