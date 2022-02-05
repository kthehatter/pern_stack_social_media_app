import React,{Fragment} from 'react';
export default function SelectedConversation(props) {
   const recieverID = props.conversation.members[0]===props.userID?props.conversation.members[1]:props.conversation.members[0];
   const recieverName = props.conversation.members[0]===props.userID?props.conversation.members_name[1]:props.conversation.members_name[0];
   let isOnline=false;
   for (let index = 0; index < props.onlineUsers.length; index++) {
     const onlineUser = props.onlineUsers[index];
     if (onlineUser.userID === recieverID) {
       isOnline=true;
       break;
     }
   }
   return(
    <Fragment >
    <div className="flex flex-row items-center p-4 bg-gradient-to-r from-red-100 to-transparent border-l-2 border-red-500 ">
    <img
              src={`http://localhost:3306/api/authentication/users/${recieverID}/avatar`}
              alt="Avatar"
              className="rounded-full h-8 w-8"
            />
              <div className="flex flex-col flex-grow ml-3">
                <div className="flex items-center">
                  <div className="text-sm font-medium">{recieverName}</div>
                  {isOnline===true&&<div className="h-2 w-2 rounded-full bg-green-500 ml-2"></div>}
                </div>
                <div className="text-xs truncate w-40">Click here to start talking</div>
              </div>
            </div>

    </Fragment>
)
}