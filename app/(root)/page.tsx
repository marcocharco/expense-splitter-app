import GroupList from '@/components/groups/GroupList'
import React from 'react'

const Home = () => {
  return (
    <section className="home">
      <div className="home-content">

        Welcome
        <GroupList />
        
      </div>
    </section>
  )
}

export default Home