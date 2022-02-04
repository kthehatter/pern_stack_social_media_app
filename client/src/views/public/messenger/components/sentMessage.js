import React,{Fragment} from 'react';
import { format} from 'timeago.js';
export default function SentMessage(props) {
return(
    <Fragment>
              <div className="flex items-center justify-start flex-row-reverse">
              <img
              src={`http://localhost:3306/api/authentication/users/${props.message.sender_id}/avatar`}
              alt="Avatar"
              className="rounded-full h-8 w-8"
            />
            <div className="flex flex-col ">
                <div
                    className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                  <div>{props.message.message}</div>
                  
                </div>
                <span className=" text-xs text-gray-500 right-0 top-0">
                    {format(props.message.created_at)}
                  </span>
                  </div>
              </div>

    </Fragment>
)
}