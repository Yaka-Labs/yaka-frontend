import React, { useMemo, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import quillEmoji from 'react-quill-emoji'
import 'react-quill-emoji/dist/quill-emoji.css'
import StyledButton from 'components/Buttons/styledButton'
import LabelTooltip from 'components/TooltipLabelComponent'
import SearchInput from 'components/Input/SearchInput'

const Index = ({
  setCreateEventComponent,
  eventName,
  setEventName,
  image,
  setImage,
  value,
  setValue,
  setType,
  type,
  eventDescription,
  setEventDescription,
}) => {
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
  const handleCompetionName = (e) => {
    setEventName(e.replace(/[^\w\s]/gi, ''))
  }
  const handleOnChange = (e) => {
    e === '<p><br></p>' ? setValue('') : setValue(e)
  }

  const checkDisable = useMemo(() => {
    let bol = true
    if (type === 'Other') {
      if (type && eventName && image && value && eventDescription) {
        bol = false
      }
    } else if (type && eventName && image && value) {
      bol = false
    }

    return bol
  }, [eventName, image, value, eventDescription, type])

  const [editImage, setEditImage] = useState(false)

  return (
    <div className='mt-5 flex flex-col items-center justify-center w-full'>
      <div className={`flex items-center justify-between w-full ${type === 'Other' ? 'space-x-6' : ''}`}>
        <div className='w-full'>
          <LabelTooltip tooltipID='eventType' label='Event Type' tooltipDescription='Example' />
          <div className='flex items-center space-x-3 mt-3'>
            <div
              onClick={() => {
                setType('Audio')
              }}
              className={`px-6 cursor-pointer py-[8.4px] text-white ${type === 'Audio' ? 'bg-blue' : 'bg-body'} rounded-full`}
            >
              Audio
            </div>
            <div
              onClick={() => {
                setType('Video')
              }}
              className={`px-6 cursor-pointer py-[8.4px] text-white ${type === 'Video' ? 'bg-blue' : 'bg-body'} rounded-full`}
            >
              Video
            </div>
            <div
              onClick={() => {
                setType('Other')
              }}
              className={`px-6 cursor-pointer py-[8.4px] text-white ${type === 'Other' ? 'bg-blue' : 'bg-body'} rounded-full`}
            >
              Other
            </div>
          </div>
        </div>
        {type === 'Other' && (
          <div className='w-full '>
            <LabelTooltip tooltipID='eventDescription' label='Describe Your Event' tooltipDescription='Example' />
            <SearchInput
              max={32}
              searchText={eventDescription}
              setSearchText={(e) => {
                setEventDescription(e)
              }}
              disableSearchIcon
              full
              className='mt-2'
            />
          </div>
        )}
      </div>
      <div className='w-full mt-5'>
        <LabelTooltip tooltipID='eventName' label='Event Name' tooltipDescription='Example tooltip' />
        <SearchInput
          max={32}
          searchText={eventName}
          setSearchText={(e) => {
            handleCompetionName(e)
          }}
          disableSearchIcon
          full
          className='mt-2'
        />
      </div>
      <div className='w-full mt-5'>
        <LabelTooltip
          tooltipID='coverImage'
          label='Cover Image'
          tooltipDescription='JPEG, PNG, GIF and SVG formats are accepted. Ideally use a size of 1920x1080px.'
        />
      </div>
      <div className='relative mt-2 bg-body w-full min-h-[200px] flex flex-col items-center justify-center rounded-[3px]'>
        {image ? (
          <>
            <img alt='' className='w-full h-full object-cover object-center' src={URL.createObjectURL(image)} />
            <div className='bg-[#0000AF] rounded-lg px-5 py-2.5 w-full absolute z-10 max-w-[208px]'>
              <div
                onClick={() => {
                  setEditImage(!editImage)
                }}
                className='flex items-center justify-between cursor-pointer'
              >
                <p className='text-base leading-5 text-white font-medium'>Edit Cover Image</p>
                <img alt='' className={`${editImage ? ' rotate-180' : 'rotate-0'} transition-all duration-200 ease-in-out`} src='/images/header/chevron.svg' />
              </div>
              {editImage && (
                <div className='text-base leading-5 text-white mt-[5px] font-medium'>
                  <button className='relative'>
                    <p>Change Cover Image</p>
                    <input
                      onChange={(e) => {
                        setImage(e.target.files[0])
                      }}
                      accept='image/JPEG, image/PNG, image/SVG , image/GIF'
                      type='file'
                      className='absolute inset-0 w-full h-full z-10 opacity-0'
                    />
                  </button>
                  <button onClick={() => setImage(null)} className='mt-1'>
                    Remove
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className='bg-blue px-5 py-[9px] text-white leading-5 rounded-full'>+ Upload Cover Photo</button>
            <input
              onChange={(e) => {
                console.log(e)
                setImage(e.target.files[0])
              }}
              accept='image/JPEG, image/PNG, image/SVG , image/GIF'
              type='file'
              className='absolute inset-0 w-full h-full z-10 opacity-0'
            />
          </>
        )}
      </div>
      <div className='w-full mt-5'>
        <LabelTooltip tooltipID='description' label='Description' tooltipDescription='Example tooltip' />
        <ReactQuill
          modules={{
            toolbar: toolbarOption,
            'emoji-toolbar': true,
            'emoji-shortname': true,
          }}
          theme='snow'
          className='bg-body h-full relative text-white mt-2'
          value={value}
          onChange={handleOnChange}
        />
      </div>
      <StyledButton
        onClickHandler={() => {
          setCreateEventComponent('TIME AND LOCATION')
        }}
        disabled={checkDisable}
        content='NEXT'
        className='py-3 mt-6 px-16'
      />
    </div>
  )
}

export default Index
