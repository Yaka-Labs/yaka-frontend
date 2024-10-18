import StyledButton from '../../components/Buttons/styledButton'
import { customNotify } from '../../utils/notify'
import React from 'react'

const InviteButton = ({ account, w = 'w-1/2' }) => {
  return account ? (
    <StyledButton
      onClickHandler={() => {
        // 使用navigator.clipboard API来复制文本
        navigator.clipboard.writeText(`https://yaka.finance/launchpad?inviter=${account}`).then(
          function () {
            customNotify('Invitation link copied to clipboard', 'success')
          },
          function (err) {
            console.error('error: ', err)
          },
        )
      }}
      content='Copy Invitation Link'
      className={`py-[8.5px] px-[13.6px] ${w} mt-[20px]`}
      isCap
    />
  ) : null
}

export default InviteButton
