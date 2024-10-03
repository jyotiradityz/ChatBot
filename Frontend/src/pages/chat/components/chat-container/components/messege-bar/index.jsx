import { useAppStore } from "@/store"
import { useSocket } from '../../../../../../../context/SocketContext'
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { Fa500Px } from "react-icons/fa"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"


const MessegeBar = () => {
    const [messege, setMessege] = useState('')
    const emojiRef = useRef();
    const [emojiPicker, setEmojiPicker] = useState(false);
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo } = useAppStore();
    

    useEffect(() => {
        function handleOutSideClick(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPicker(false);
            }
        }
        document.addEventListener('mousedown', handleOutSideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutSideClick)
        }
    }, [emojiRef]);

    const handleAddEmoji = (emoji) => {
        setMessege((msg) => msg + emoji.emoji)
    }

    const handleSendMessege = async (e) => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: messege,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
            setMessege("");
            console.log("Messege Sent");
        }
    }

    return (
        <div className=" h-[10vw] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 " >
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 ">
                <input type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none "
                    placeholder="Enter Your Message"
                    value={messege}
                    onChange={(e) => setMessege(e.target.value)}
                />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '  >
                    <GrAttachment className="text-2xl" />
                </button>

                <div className="relative  ">
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all ' onClick={(e) => { setEmojiPicker(true) }} >
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={emojiPicker}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all ' onClick={handleSendMessege}>
                <IoSend className="text-2xl" />
            </button>

        </div>
    )
}

export default MessegeBar
