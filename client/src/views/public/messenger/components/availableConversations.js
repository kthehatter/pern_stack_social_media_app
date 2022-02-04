import React,{Fragment} from 'react';
export default function AvailableConversations(props) {
   const recieverID = props.conversation.members[0]===props.userID?props.conversation.members[1]:props.conversation.members[0];
   const recieverName = props.conversation.members[0]===props.userID?props.conversation.members_name[1]:props.conversation.members_name[0];
return(
    <Fragment>
    <div
              className="flex flex-row items-center rounded-xl p-2"
                

            >
            
                <img
              src={`http://localhost:3306/api/authentication/users/${recieverID}/avatar`}
              alt="Avatar"
              className="rounded-full h-8 w-8"
            />
              <div className="ml-2 text-sm font-semibold">{recieverName}</div>
            </div>
    </Fragment>
)
}