import React from 'react'
import GroupCard from './GroupCard'

const GroupList = () => {
  return (
    <div className="flex w-full flex-col gap-4">
        <GroupCard 
            groupName={"Group 1"}
        />

        <GroupCard 
            groupName={"Group 2"}
        />

        <GroupCard 
            groupName={"Group 3"}
        />
    </div>
  )
}

export default GroupList