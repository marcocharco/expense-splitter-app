import React from 'react'

const GroupCard = ({
    groupName
}: GroupCardProps) => {
  return (
    <div className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6">
        <p>{groupName}</p>
    </div>
  )
}

export default GroupCard