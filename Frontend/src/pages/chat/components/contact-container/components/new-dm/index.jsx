import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { animationDefaultOptions, getColor } from '@/lib/utils'
import Lottie from 'react-lottie'
import apiClient from '@/lib/api-client'
import { HOST, SEARCH_CONTACTS_ROUTE } from '@/utils/constant'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { useAppStore } from '@/store'

const NewDM = () => {

    const { setSelectedChatType, setSelectedChatData } = useAppStore();

    const [openNewContantModal, setOpenNewContactModel] = useState(false);
    const [searchedContacts, setSearchContacts] = useState([])

    const searchContactsFunction = async (searchTerm) => {
        try {
            if (searchTerm.length <= 0) {

                setSearchContacts([])
                console.log(searchedContacts);
            }
            const res = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm }, { withCredentials: true })
            if (res.status === 200 && res.data.contacts) {
                setSearchContacts(res.data.contacts)
            }
        } catch (err) {
            console.log({ err });
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModel(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchContacts([]);
    }



    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><FaPlus className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer duration-300 transition-all'
                        onClick={() => setOpenNewContactModel(true)}
                    /></TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-whitex " >
                        Select New Contanct
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContantModal} onOpenChange={setOpenNewContactModel} >
                <DialogContent className="bg-[#1c1d25] border-none text-white w-[400px] h-[400px] flex flex-col  " >
                    <DialogHeader  >
                        <DialogTitle className="mx-auto" >Please Select the Contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none "
                            onChange={(e) => searchContactsFunction(e.target.value)}
                        />
                    </div>
                    {
                        searchedContacts.length > 0 &&
                        <ScrollArea className='h-[250px]'>
                            <div className='flex flex-col gap-5' >
                                {
                                    searchedContacts.map((contact) =>
                                        <div key={contact._id} className='flex gap-3 items-center cursor-pointer ' onClick={() => selectNewContact(contact)}>
                                            <div className='w-12 h-12  relative' >
                                                <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                                                    {
                                                        contact.image ?
                                                            <AvatarImage src={`${HOST}/${contact.image}`} alt='profile' className="object-cover w-full h-full bg-black rounded-full " /> :
                                                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)} `} >
                                                                {
                                                                    contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                                                                }
                                                            </div>
                                                    }
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col  ">
                                                <span>
                                                    {
                                                        (contact.firstName && contact.lastName) ? `${contact.firstName} ${contact.lastName}` : "Nothing here"
                                                    }
                                                </span>
                                                <span className='text-xs'>
                                                    {contact.email}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </ScrollArea>
                    }
                    {
                        searchedContacts.length <= 0 &&
                        (<div className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all'>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={200}
                                width={200}
                                options={
                                    animationDefaultOptions
                                }
                            />
                        </div>)
                    }
                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDM
