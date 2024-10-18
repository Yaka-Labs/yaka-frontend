import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../card'
import Info from '../info'
import CompetitionPost from '../competitionPost'
import EventPost from '../eventPost'
import Badge from '../badge'
import NFT from '../nft'

const Index = ({ posts, userProfile, home = false, setPosts, postData = {} }) => {
  const renderCard = (item) => {
    switch (item.type) {
      case 'info':
        return <Info data={item} />
      case 'badge':
        return <Badge data={item} />
      case 'competitionpost':
        return <CompetitionPost data={item} />
      case 'eventpost':
        return <EventPost data={item} />
      case 'nft':
        return <NFT data={item} />
      default:
    }
  }

  const params = useParams()

  const allPosts = useMemo(() => {
    if (Object.keys(postData).length === 0 && !params.id) {
      return posts
    } else {
      return posts.filter((item) => item.id === postData.id || item.id)
    }
  }, [posts, postData])

  return (
    <>
      {allPosts.map((item, idx) => {
        return (
          <Card allPosts={posts} setPosts={setPosts} idx={idx} data={item} home={home} userProfile={userProfile} key={idx} param={params.id}>
            {renderCard(item)}
          </Card>
        )
      })}
    </>
  )
}

export default Index
