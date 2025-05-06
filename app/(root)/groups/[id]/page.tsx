import React from 'react'

const groupPage = ({ params }: { params: { id: string } }) => {
    const group = [params.id]

  return (
    <section>
      
      <h1>Group {group}</h1>

      <div>
        Add Expense
        Settle Expenses
      </div>
      
      <div>
        Recent Activity
        Balances
        Members
      </div>
    
    </section>


  )
}

export default groupPage