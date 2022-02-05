
import React,{Fragment,useEffect,useState,useRef} from 'react';
import InputEmoji from 'react-input-emoji';
import {useSelector} from 'react-redux';
import { fetchConversationsApiCall,fetchChatMessagesApiCall ,sendChatMessageApiCall} from "../../../services/messenger/conversations";
import AvailableConversations from './components/availableConversations';
import SelectedConversation from './components/selectedConversation';
import SentMessage from './components/sentMessage';
import RecievedMessage from './components/recievedMessage';
import { io } from "socket.io-client";
export default function ChatPage(props) {
const socket = useRef();
const user = useSelector(state => state.user.value);
const accessToken = localStorage.getItem("accessToken");
    const scrollRef = useRef();
  let [ message, setMessage ] = useState('');
  let [ currentChat, setCurrentChat ] = useState(null);
    let [ chatMessages, setChatMessages ] = useState([]);
    let [ arrivalMessage, setArrivalMessage ] = useState(null);
    let [ conversations, setConversations ] = useState([]);
    let [ onlineUsers, setOnlineUsers ] = useState([]);
    const fetchChatMessages = async () => {
        await fetchChatMessagesApiCall(currentChat.conversation_id).then(res => {
          if (res.status === 200) {
            console.log(res.data.conversationMessage);
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
            setChatMessages(res.data.newMessages?res.data.newMessages:chatMessages);
            const recieverID = currentChat.members.find(member => member !== user.id);
            socket.current.emit("sendMessage",{accessToken:accessToken,recieverID:recieverID,conversationId:currentChat.conversation_id,message:message,messageType:messageType});
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
    if (message !== '') {
    sendMessage('text');
    }
  }
  useEffect(() => {
    socket.current=io.connect("http://localhost:3306");
  },[]);
  useEffect(() => {
    socket.current.emit('addUser',{userId:user.id,accessToken:accessToken});
    socket.current.on('getUsers',onlineUsers => {
      setOnlineUsers(onlineUsers);
    });
  },[accessToken, user.id]);
  useEffect(() => {
    socket.current.on('getMessage',data => {
      console.log(data);
      setChatMessages((prev)=>[...prev,{
        conversation_id:data.conversationID?data.conversationID:'',
        created_at:Date.now(),
        message:data.message?data.message:'',
        message_audio: null,
        message_id: 11,
        message_image: null,
        messageType:data.messageType?data.messageType:'text',
        message_video: null,
        sender_id:data.senderID?data.senderID:'',
        updated_at:Date.now(),
      }]);
          });
  } ,[socket]);
  useEffect(() => {
    document.title = props.title || "";
    fetchConversations();
    
    scrollRef.current?.scrollIntoView();

}, [chatMessages, props.title]);

    return(
        <Fragment >
            <div className="flex flex-row h-screen antialiased text-gray-800">
    <div className="flex flex-row w-96 flex-shrink-0 bg-gray-100 p-4">
      <div className="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-indigo-800 rounded-3xl">
        <a href="#"
           className="flex items-center justify-center h-12 w-12 bg-indigo-100 text-indigo-800 rounded-full">
          <svg className="w-8 h-8"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
        </a>
        <ul className="flex flex-col space-y-2 mt-12">
          <li>
            <a href="#"
               className="flex items-center">
              <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                <svg className="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </span>
            </a>
          </li>
          <li>
            <a href="#"
               className="flex items-center">
              <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                <svg className="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </span>
            </a>
          </li>
          <li>
            <a href="#"
               className="flex items-center">
              <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                <svg className="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </span>
            </a>
          </li>
          <li>
            <a href="#"
               className="flex items-center">
              <span className="flex items-center justify-center text-indigo-100 hover:bg-indigo-700 h-12 w-12 rounded-2xl">
                <svg className="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </span>
            </a>
          </li>
        </ul>
        <button className="mt-auto flex items-center justify-center hover:text-indigo-100 text-indigo-500 h-10 w-10">
          <svg className="w-6 h-6"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
      </div>
      <div className="flex flex-col w-full h-full pl-4 pr-4 py-4 -mr-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center">
            <div className="text-xl font-semibold">Messages</div>
            <div className="flex items-center justify-center ml-2 text-xs h-5 w-5 text-white bg-red-500 rounded-full font-medium">5</div>
          </div>
          <div className="ml-auto">
            <button className="flex items-center justify-center h-7 w-7 bg-gray-200 text-gray-500 rounded-full">
              <svg className="w-4 h-4 stroke-current"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-5">
          <ul className="flex flex-row items-center justify-between">
            <li>
              <a href="#"
                 className="flex items-center pb-3 text-xs font-semibold relative text-indigo-800">
                <span>All Conversations</span>
                <span className="absolute left-0 bottom-0 h-1 w-6 bg-indigo-800 rounded-full"></span>
              </a>
            </li>
            <li>
              <a href="#"
                 className="flex items-center pb-3 text-xs text-gray-700 font-semibold">
                <span>Archived</span>
              </a>
            </li>
            <li>
              <a href="#"
                 className="flex items-center pb-3 text-xs text-gray-700 font-semibold">
                <span>Starred</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-5">
          <div className="text-xs text-gray-400 font-semibold uppercase">Team</div>
        </div>
        <div className="mt-2">
          <div className="flex flex-col -mx-4">
            {conversations&&conversations.length > 0 && conversations.map((conversation, index) =>{
                return(currentChat===null || currentChat.conversation_id !== conversation.conversation_id? <div className="hover:bg-red-100 cursor-pointer" onClick={()=>{
                    currentChat = conversation;
                    setCurrentChat(conversation);
                    fetchChatMessages();
                }}> <AvailableConversations onlineUsers={onlineUsers} userID={user.id} conversation={conversation} /></div>:<div className="hover:bg-red-100 cursor-pointer"><SelectedConversation onlineUsers={onlineUsers} userID={user.id} conversation={conversation} /></div>
                )
            })}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col h-full w-full bg-white px-4 py-6">
      <div className="flex flex-row items-center py-4 px-6 rounded-2xl shadow">
      {currentChat&&(currentChat.members[0]===user.id?<img
              src={`http://localhost:3306/api/authentication/users/${currentChat.members[1]}/avatar`}
              alt="Avatar"
              className="rounded-full h-8 w-8"
            />:<img
              src={`http://localhost:3306/api/authentication/users/${currentChat.members[0]}/avatar`}
              alt="Avatar"
              className="rounded-full h-8 w-8"
            />)}
        <div className="flex flex-col ml-3">
          {currentChat&&<div className="font-semibold text-sm">{currentChat.members[0]===user.id?currentChat.members_name[1]:currentChat.members_name[0]}</div>}
          {!currentChat&&<div className="font-semibold text-sm"></div>}
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div className="ml-auto">
          <ul className="flex flex-row items-center space-x-2">
            <li>
              <a href="#"
                 className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                <span>
                  <svg className="w-5 h-5"
                       fill="currentColor"
                       stroke="none"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </span>
              </a>
            </li>
            <li>
              <a href="#"
                 className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                <span>
                  <svg className="w-5 h-5"
                       fill="currentColor"
                       stroke="none"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </span>
              </a>
            </li>
            <li>
              <a href="#"
                 className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                <span>
                  <svg className="w-5 h-5"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-full overflow-hidden py-4">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-12 gap-y-2">
            {chatMessages&&chatMessages.length > 0 && chatMessages.map((message, index) =>{
    
                return(
                    message.sender_id===user.id?<div ref={scrollRef} className="col-start-6 col-end-13 p-3 rounded-lg"><SentMessage message={message}/></div>:<div ref={scrollRef} className="col-start-1 col-end-8 p-3 rounded-lg"><RecievedMessage message={message}/></div>
                )
            })
            }
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center w-full border rounded-3xl h-12 px-2">
          <button className="flex items-center justify-center h-10 w-10 text-gray-400 ml-1">
            <svg className="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </button>
          <div className="w-full">
          <InputEmoji
          value={message}
          onChange={setMessage}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />
          </div>
          <div className="flex flex-row">
            <button className="flex items-center justify-center h-10 w-8 text-gray-400" >
              <svg className="w-5 h-5"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <button className="flex items-center justify-center h-10 w-8 text-gray-400 ml-1 mr-2">
              <svg className="w-5 h-5"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="ml-6">
          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800 text-white" onClick={()=>{handleOnEnter();
          setMessage('');
          }}>
            <svg className="w-5 h-5 transform rotate-90 -mr-px"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
        </Fragment>)
}