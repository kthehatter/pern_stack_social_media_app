import React,{Fragment,useEffect,useState} from 'react';
import InputEmoji from 'react-input-emoji';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import user_icon from '../../../assets/images/user_icon.png'
import { fetchConversationsApiCall,fetchChatMessagesApiCall ,sendChatMessageApiCall} from "../../../services/messenger/conversations";
import AvailableConversations from './components/availableConversations';
import SentMessage from './components/sentMessage';
import RecievedMessage from './components/recievedMessage';
export default function MessengerPage(props) {
  const user = useSelector(state => state.user.value);
  let [ message, setMessage ] = useState('');
    let [ currentChat, setCurrentChat ] = useState(null);
    let [ chatMessages, setChatMessages ] = useState([]);
    let [ conversations, setConversations ] = useState([]);
    const fetchChatMessages = async () => {
        await fetchChatMessagesApiCall(currentChat.conversation_id).then(res => {
          if (res.status === 200) {
            setChatMessages(res.data.conversationMessage?res.data.conversationMessage:[]);
          }else{
            console.log(res.data);
            setChatMessages([]);
          }
        }).catch(err => {
            setChatMessages([]);
            console.log(err);
        });
    }
    const sendMessage = async (messageType) => {
      try{
        await sendChatMessageApiCall(currentChat.conversation_id,message,messageType).then(res => {
          if(res.status === 200){
            setMessage('');
            fetchChatMessages();
          }
        }).catch(err => {
          console.log(err);
        });
      }catch(e){
        console.log(e);
      }

    }
    const fetchConversations = async () =>{
      try {
        await fetchConversationsApiCall().then(res => {
          if(res.status === 200){
            setConversations(res.data.conversations);
          }
        }).catch(err => {
          console.log(err);
        }
        );
      } catch (e) {
        console.log(e);
      }
    };
    function handleOnEnter (text) {
        console.log('enter', text)
        console.log('message', message)
        sendMessage('text');
      }
    useEffect(() => {
        document.title = props.title || "";
        fetchConversations();
    }, [props.title,]);
    return(
<Fragment>
<div className="flex h-screen antialiased text-gray-800">
    <div className="flex flex-row h-full w-full overflow-x-hidden">
      <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div
            className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div className="ml-2 font-bold text-2xl">QuickChat</div>
        </div>
        <div
          className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
        >
          <div className="h-20 w-20 rounded-full border overflow-hidden">
            {user.id&&user.id!==''?<img
              src={`http://localhost:3306/api/authentication/users/${user.id}/avatar`}
              alt="Avatar"
              className="h-full w-full"
            />:<img
              src={user_icon}
              alt="Avatar"
              className="h-full w-full"
            />}
          </div>
          {user.name&&user.name!==''?<div className="text-sm font-semibold mt-2">{user.name}</div>:<div className="text-sm font-semibold mt-2">YOUR NAME</div>}
          {user.email&&user.email!==''?<div className="text-xs text-gray-500">{user.email}</div>:<div className="text-xs text-gray-500">example@email.com</div>}
          <div className="flex flex-row items-center mt-3">
            <div
              className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full"
            >
              <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
            </div>
            <div className="leading-none ml-1 text-xs">Active</div>
          </div>
        </div>
        <div className="flex flex-col mt-8">
          <div className="flex flex-row items-center justify-between text-xs">
            <span className="font-bold">Active Conversations</span>
            <span
              className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
              >4</span
            >
          </div>
          <div className="flex flex-col space-y-1 mt-4 -mx-2 h-80 overflow-y-auto">
            {conversations.length>0 &&conversations.map((conversation,index)=>{
              return(
                <div  className={currentChat===null || currentChat.conversation_id !== conversation.conversation_id ? `cursor-pointer hover:bg-indigo-200`:`cursor-pointer bg-indigo-100 hover:bg-indigo-200`} onClick={()=>{
                setCurrentChat(conversation);
                currentChat = conversation;
                fetchChatMessages();
                }}>
                <AvailableConversations userID={user.id} conversation={conversation} index={index}/>
                </div>
               
              )
            })}


            
            
          </div>
          
        </div>
      </div>
      <div className="flex flex-col flex-auto h-full p-6">
        <div
          className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        {!currentChat && <span className=" h-full text-center align-middle	 text-5xl text-gray-300">
                  Select a user to start a new conversation.
                </span>}
        {currentChat&&
          <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-12 gap-y-2">
                {chatMessages && chatMessages.map((message,index)=>{
                  return  message.sender_id===user.id?<SentMessage message={message}/>:<RecievedMessage message={message}/>
                })
                }
              </div>
            </div>
          </div>}

          <div
            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
          >
            <div>
              <button
                className="flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex-grow ml-4">
              <div className="relative w-full">
                
                <InputEmoji
          value={message}
          onChange={setMessage}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
          className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
        />
              </div>
            </div>
            <div className="ml-4">
              <button
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
                <span>Send</span>
                <span className="ml-2">
                  <svg
                    className="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Fragment>

    )
}