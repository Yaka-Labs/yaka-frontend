import React from 'react'
import Card from '../card'
import IconWithDescription from '../notificationsTypes/iconWithDescription'
import ImageWithDescription from '../notificationsTypes/imageWithDescription'

const Index = ({ notifications }) => {
  const renderNotifications = (item) => {
    switch (item.type) {
      case 'competition':
      case 'competitionWithReward':
      case 'events':
      case 'lottery':
      case 'pool':
        return <IconWithDescription data={item} />
      case 'comment':
      case 'like':
      case 'mentioned':
      case 'achievement':
      case 'follow':
      case 'invitation':
      case 'transiction':
      case 'nftOffer':
        return <ImageWithDescription data={item} />
      default:
    }
  }
  return notifications.map((item, idx) => {
    return (
      <Card key={idx} notification={item}>
        {renderNotifications(item)}
      </Card>
    )
  })
}

export default Index
