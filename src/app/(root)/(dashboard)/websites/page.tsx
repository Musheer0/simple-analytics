import AddWebsiteDialog from '@/features/websites/components/add-website-dialog'
import Header from '@/features/websites/components/header'
import WebsiteListPaginated from '@/features/websites/components/website-list-paginated'
import { RequireAuth } from '@/lib/requireAuth'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'

const page = async() => {
   const session =  await RequireAuth()
   console.log(session.orgId)
  if(session.orgId)
  return (
    <div className='w-full min-h-screen'>
      <Header/>
      <WebsiteListPaginated orgId={session.orgId}/>
    </div>
  )
}

export default page
