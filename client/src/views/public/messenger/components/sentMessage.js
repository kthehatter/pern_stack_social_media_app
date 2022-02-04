import React,{Fragment} from 'react';
export default function SentMessage(props) {
return(
    <Fragment>
    <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                      <div>{props.message}</div>
                    </div>
                  </div>
                </div>
    </Fragment>
)
}