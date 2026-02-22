"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { AddWebsite } from '../actions/mutations';
import { toast } from 'sonner';

const AddWebsiteDialog = ({children}:{children:React.ReactNode}) => {
    const [domain ,setDomain] = useState('');
    const [open ,setOpen] =useState(false);
    const {mutate,isPending} = useMutation({
        mutationKey:['add-website'],
        mutationFn:AddWebsite,
        onSettled:()=>{
            setOpen(false)
        },
        onError:(e)=>{
            toast.error(e.message)
        },
        onSuccess:()=>{
            toast.success('added website')
        }
    });
    const handleClick = ()=>{
        mutate({domain})
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Website</DialogTitle>
                <DialogDescription>
                    Enter the website domain you want to add
                </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-2'>
                <Label>
                    Domain
                </Label>
                <Input placeholder='domain' alt='domain' name='domain'
                value={domain}
                onChange={(e)=>setDomain(e.target.value)}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild disabled={isPending}>
                    <Button variant={'destructive'}> Cancel </Button>
                </DialogClose>
                <Button onClick={handleClick} disabled={isPending}>
                    {isPending ? 'Adding' : 'Add'}
                </Button>
            </DialogFooter> 
        </DialogContent>
    </Dialog>
  )
}

export default AddWebsiteDialog
