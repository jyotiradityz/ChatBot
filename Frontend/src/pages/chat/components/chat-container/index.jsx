import CharHeader from "./components/chat-header"
import MessegeBar from "./components/messege-bar"
import MessegeContainer from "./components/messege-container"

const ChatContainer = () => {
  return (
    <div className='fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 '>
        <CharHeader />
        <MessegeContainer />
        <MessegeBar/>
    </div>

  )
}

export default ChatContainer
