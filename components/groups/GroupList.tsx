"use client"

import React, { useState } from 'react'
import GroupCard from './GroupCard'

const groupList = [
  {
    id: "1",
    name: "Housemates",
    members: [
      {
        id: "1",
        name: "Bob"
      },
      {
        id: "2",
        name: "Rick"
      },
      {
        id: "3",
        name: "Jack"
      },
      {
        id: "4",
        name: "Dave"
      }
    ]

  },
  {
    id: "2",
    name: "Cottage Trip",
    members: [
      {
        id: "1",
        name: "Bob"
      }
    ]

  }
]

const GroupList = () => {
  const [groups] = useState(groupList)
  return (
    <div className="flex w-full flex-col gap-4">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          $id={group.id}
          name={group.name}
          members={group.members}
      />
      ))}
    </div>
  )
}

export default GroupList