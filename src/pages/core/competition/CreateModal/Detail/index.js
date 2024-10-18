import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import quillEmoji from 'react-quill-emoji'
import LabelTooltip from 'components/TooltipLabelComponent'
import 'react-quill/dist/quill.snow.css'
import 'react-quill-emoji/dist/quill-emoji.css'
import BlueInput from 'components/Input/BlueInput'

// setImage
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

const Detail = ({ data, setData }) => {
  // const [editImage, setEditImage] = useState(false)

  return (
    <>
      <div className='w-full'>
        <LabelTooltip
          tooltipID='tradingCompetition'
          label='Trading Competition Name'
          tooltipDescription='This is the name of your trading competition, which will be displayed on the trading competition feed.'
        />
        <BlueInput
          className='mt-1.5 md:mt-2'
          type='text'
          value={data.name}
          onChange={(value) => {
            const val = value.replace(/[^\w\s]/gi, '')
            setData({
              ...data,
              name: val,
            })
          }}
          maxLength='32'
          required
        />
      </div>
      {/* <div className='w-full mt-5'>
        <LabelTooltip
          tooltipID={'coverImage'}
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
                      type={'file'}
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
                setImage(e.target.files[0])
              }}
              accept='image/JPEG, image/PNG, image/SVG , image/GIF'
              type={'file'}
              className='absolute inset-0 w-full h-full z-10 opacity-0'
            />
          </>
        )}
      </div> */}
      <div className='w-full mt-3 md:mt-5'>
        <LabelTooltip
          tooltipID='description'
          label='Description'
          tooltipDescription='Put the description for your trading competition here. You can use up to 2,000 characters and format it whatever way you would like.'
        />
        <ReactQuill
          modules={{
            toolbar: toolbarOption,
            'emoji-toolbar': true,
            'emoji-shortname': true,
          }}
          theme='snow'
          className='bg-body h-full relative text-white mt-1.5 md:mt-2'
          value={data.description}
          onChange={(e) => {
            const val = e === '<p><br></p>' ? '' : e
            setData({
              ...data,
              description: val,
            })
          }}
        />
      </div>
    </>
  )
}

export default Detail
