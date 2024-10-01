import { useEffect, useRef } from "react";
import moment from "moment";
import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";

const MessegeContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMesseges, setSelectedMessages } = useAppStore();

  useEffect(() => {

    const getMessages = async () => {
      try {
        const res = apiClient.post("/messages/get-messages", { id: selectedChatData._id });
      } catch (error) {
        console.log(error);
        
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        setSelectedMessages(selectedChatData._id)
      }
    }



  }, [selectedChatData, selectedChatType, setSelectedMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMesseges])


  const renderMessages = () => {

    let lastDate = null;
    return selectedChatMesseges.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = lastDate !== messageDate;
      lastDate = messageDate;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2 " >
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {
            selectedChatType === "contact" && renderDM(message)
          }
        </div>
      )
    })
  }

  const renderDM = (message) => (

    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}>
      {message.messageType === "text" && (
        <div className={`${message.sender !== selectedChatData._id
          ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}

      <div className="text-xs text-gray-600 " >
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  )

  return (
    <div className=" flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full" >
      {
        renderMessages()
      }
      <div ref={scrollRef}>

      </div>
    </div>
  )
}

export default MessegeContainer
