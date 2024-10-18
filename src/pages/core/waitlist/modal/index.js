import React, { useEffect, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import quillEmoji from 'react-quill-emoji'
import Modal from 'components/Modal'
import SimpleInput from 'components/Input/simpleInput'
import LabelTooltip from 'components/TooltipLabelComponent'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import 'react-quill-emoji/dist/quill-emoji.css'
import 'react-quill/dist/quill.snow.css'

const Index = ({ setCreatePool, createPool, edit = false, data }) => {
  const [formData, setFormData] = useState({
    poolName: edit ? data.name : '',
    description: edit ? data.des : '',
  })
  const [type, setType] = useState('')
  useEffect(() => {
    if (edit) {
      setType(data.type.toLowerCase())
    }
  }, [data])

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
          description: '',
        })
      : setFormData({
          ...formData,
          description: e,
        })
  }
  return (
    <Modal popup={createPool} setPopup={setCreatePool} title='Create New Poll' width={595}>
      <div className='mt-[22px]'>
        {edit && (
          <>
            <LabelTooltip tooltipID='pollStatus' label='Poll Status' tooltipDescription='Example tooltip' />
            <div className='flex items-center space-x-3 mt-3 mb-5'>
              <div
                onClick={() => {
                  setType('active')
                }}
                className={`px-6 cursor-pointer py-[8.4px] text-white ${type === 'active' ? 'bg-blue' : 'bg-body'} rounded-full`}
              >
                Active
              </div>
              <div
                onClick={() => {
                  setType('approved')
                }}
                className={`px-6 cursor-pointer py-[8.4px] text-white ${type === 'approved' ? 'bg-blue' : 'bg-body'} rounded-full`}
              >
                Approved
              </div>
              <div
                onClick={() => {
                  setType('archived')
                }}
                className={`px-6 cursor-pointer py-[8.4px] text-white ${type === 'archived' ? 'bg-blue' : 'bg-body'} rounded-full`}
              >
                Archived
              </div>
            </div>
          </>
        )}
        <LabelTooltip tooltipID='poolName' label='Poll Name' tooltipDescription='Example tooltip' />
        <SimpleInput
          typedString={formData.poolName}
          onChange={(e) => {
            setFormData({
              ...formData,
              poolName: e.target.value,
            })
          }}
          className='mt-2'
        />
        <LabelTooltip tooltipID='description' className='mt-6' label='Description' tooltipDescription='Example tooltip' />
        <ReactQuill
          modules={{
            toolbar: toolbarOption,
            'emoji-toolbar': true,
            'emoji-shortname': true,
          }}
          theme='snow'
          className='bg-body h-full relative text-white mt-2 border border-blue'
          value={formData.description}
          onChange={handleOnChange}
        />
        <div className='flex items-center justify-center space-x-5 mt-6'>
          <TransparentButton
            content='CANCEL'
            onClickHandler={() => {
              setCreatePool(false)
            }}
            className='px-[52px] py-3'
            isUpper
          />
          <StyledButton
            onClickHandler={() => {}}
            content={edit ? 'SAVE CHANGES' : 'CREATE POLL'}
            disabled={!formData.poolName || !formData.description}
            className='py-3 px-9'
          />
        </div>
      </div>
    </Modal>
  )
}

export default Index
