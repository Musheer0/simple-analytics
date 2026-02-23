"use client"

import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger
} from '@/components/ui/sidebar'
import GeneralMenus from './general-menus'
import { OrganizationProfile, OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function MainSidebar() {
  const router = useRouter()



  return (
    <Sidebar className='border-none py-2' collapsible='icon'>
      
      {/* Logo + Trigger */}
      <SidebarGroup>
        <SidebarGroupContent className='flex items-center group-data-[collapsible=icon]:justify-center justify-between'>
          <img
            src='/globe.svg'
            width={25}
            height={25}
            alt='Simple Analytics'
            className='group-data-[collapsible=icon]:hidden'
          />
          <SidebarTrigger />
        </SidebarGroupContent>
      </SidebarGroup>

   
      <GeneralMenus />
      <SidebarGroup>
        <SidebarGroupContent>
             <SidebarGroupLabel>Organization</SidebarGroupLabel>
        <OrganizationSwitcher
        hidePersonal
          appearance={{
                elements:{
                    rootBox:'w-full!  h-10! pl-2!',
                    avatarBox:'size-4! rounded-sm!',
                    organizationPreview:'group-data-[collapsible=icon]:justify-center! gap-2!   ',
                    organizationSwitcherTrigger:'w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2',
                    organizationPreviewTextContainer:'group-data-[collapsible=icon]:hidden! text-xs! text-sidebar-foreground! font-medium! ',
                    organizationSwitcherTriggerIcon:'group-data-[collapsible=icon]:hidden! ml-auto'
                }
            }}
        />
        </SidebarGroupContent>
      </SidebarGroup>
      <div className='flex-1' />

      {/* Footer */}
      <SidebarFooter>
       
        <UserButton
          showName
            appearance={{
                       elements:{
                rootBox:'w-full! h-8!',
                userButtonTrigger: 'w-full! p-2! hover:bg-sidebar-accent! hovr:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                userButtonBox:'w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!',
                userButtonOuterIdentifier: 'pl-0! group-data-[collapsible=icon]:hidden!'
            }
                    }}
        />
      </SidebarFooter>

    </Sidebar>
  )
}