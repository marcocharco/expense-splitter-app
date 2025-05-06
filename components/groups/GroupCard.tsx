import Link from 'next/link'
import React from 'react'

const GroupCard = ({
    groupName
}: GroupCardProps) => {
  return (
    <Link href="/" className="hover:bg-gray-50">
    
      <div className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6">
          <p>{groupName}</p>
      </div>
    </Link>
  )
}

export default GroupCard