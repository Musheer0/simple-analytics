import React from 'react'
import AddWebsiteDialog from './add-website-dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const Header = () => {
  return (
    <div className='w-full flex items-center justify-between px-4 py-3'>
      <p className='font-semibold text-lg'>Your Websites</p>

      <AddWebsiteDialog>
        <Button>
            <PlusIcon/>Create Website
        </Button>
      </AddWebsiteDialog>
    </div>
  )
}

export default Header
