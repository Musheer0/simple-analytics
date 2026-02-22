import AddWebsiteDialog from '@/app/features/websites/components/add-website-dialog'
import { RequireAuth } from '@/lib/requireAuth'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'

const page = async() => {
   const session =  await RequireAuth()
   console.log(session.orgId)
  return (
    <div>
      <UserButton/>
      <OrganizationSwitcher/>
      <AddWebsiteDialog>
        <p>Add</p>
      </AddWebsiteDialog>
    </div>
  )
}

export default page
