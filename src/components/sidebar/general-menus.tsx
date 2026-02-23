"use client"
import React, { useEffect, useState } from 'react'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton } from '../ui/sidebar'
import { HugeiconsIcon, } from '@hugeicons/react';
import { AddressBookIcon, Analytics, BrowserIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils';
import Link from 'next/link';
const routes = [
    {
        name:'websites',
        route:'/websites',
        icon:BrowserIcon
    },
        {
        name:'analytics',
        route:'/analytics',
        icon:Analytics
    },
]
const GeneralMenus = () => {
    const [activeRoute , setActiveRoute] = useState('');
    useEffect(()=>{
        setActiveRoute(window?.location?.href||'')
    },[])

  return (
    <SidebarGroup>
        <SidebarGroupContent>
            <SidebarGroupLabel>
                General
            </SidebarGroupLabel>
           <SidebarMenu>
             {routes.map((r,i)=>{
                const isActive = activeRoute.includes(r.route)
                return (
                    <React.Fragment key={i}>
                        <Link href={r.route} onClick={(e)=>{
                            if(r.route==='/analytics'){
                                e.preventDefault() 
                                return;
                            }
                            setActiveRoute(r.route)
                        }}>
                        <SidebarMenuButton tooltip={r.name} className={cn(
                            'cursor-pointer',
                            isActive && 'bg-sidebar-accent-foreground/10 '
                        )}
                          style={isActive ? 
                                {boxShadow:`
                                0px 1px  2px rgb(22,22,22) 
                                `}:{}}
                                >
                            <HugeiconsIcon icon={r.icon} size={16} className='opacity-90'/>
                            {r.name}
                        </SidebarMenuButton>
                        </Link>
                    </React.Fragment>
                )
            })}
           </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default GeneralMenus