import { useAppStore } from '@/store'
import { HOST, LOG_OUT_ROUTES, LOGIN_ROUTE } from '@/utils/constant';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { getColor } from './../../../../../../lib/utils';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { FaEdit } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';
import apiClient from '@/lib/api-client';


const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const logOut = async() =>{
        try {
                const res = await apiClient.post(LOG_OUT_ROUTES,{},{
                    withCredentials:true
                })
                console.log(res);
                console.log(res.status);
                
                if(res.status===200){
                    navigate('/auth');
                    setUserInfo(null);
                }
            
        } catch (error) {
            console.log(error);
            
        }
    }    
    


    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ' >
            <div className="flex gap-3 items-center justify-center">
                <div className='w-12 h-12  relative' >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                        {
                            userInfo.image ?
                                <AvatarImage src={`${HOST}/${userInfo.image}`} alt='profile' className="object-cover w-full h-full bg-black" /> :
                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `} >
                                    {
                                        userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()
                                    }
                                </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        (userInfo.firstName && userInfo.lastName) ? `${userInfo.firstName} ${userInfo.lastName}` : "Nothing here"
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className='text-purple-500 text-xl font-me' onClick={()=>navigate('/profile')} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white' >
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className='text-purple-500 text-xl font-me' onClick={logOut} />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white' >
                            LogOut
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo
{/* <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden ">
              {
                image ? <AvatarImage src={image} alt='profile' className="object-cover w-full h-full bg-black" /> :
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)} `} >
                    {
                      firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                    }
                  </div>
              }
            </Avatar> */}