'use client'

import { useState, useEffect, useRef } from "react";
import SendMessage from "../SendMessage";
import GetMessages from "../GetMessages";
import Sessiondetails from "../Session.user";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeattr from 'rehype-attr'

export default function Chatroom() {
'use client'
const [gotmessages, setGotmessages] = useState([]);
const [session, setSession] = useState([]);
const [inputmessage, setInputmessage] = useState("");
const hasRungotmessages = useRef(false);
const hasRunsession = useRef(false);

const sendMessage = async (event) => {
  event.preventDefault();
  
  SendMessage(inputmessage);
  
  setInputmessage("");
}

useEffect(() => { 
    if (!hasRunsession.current && session.length === 0) {
        const getinitialsession = async () => {
            const session = await Sessiondetails();
            setSession(session);
        }
        getinitialsession();
        hasRunsession.current = true;
    }
}, [session]);

useEffect(() => {
    if (!hasRungotmessages.current && gotmessages.length === 0) {
        const getinitialmessage = async () => {
            const messages = await GetMessages();
            setGotmessages(messages);
        }
        getinitialmessage();
        hasRungotmessages.current = true;
    }
}, [gotmessages]);



return (
    <>
        <div className="border-2 border-white chatroom flex flex-col justify-end">
        
        {/* WRAP MESSAGES AREA START */}        

        
          <div className="overflow-y-auto messages-container m-4">
            {(() => {
              let prevSenderid = null;
              let prevFormattedDate = null;
              let prevFormattedTime = null;
          
              return gotmessages.slice().reverse().map((message, index) => {
                const messageDate = new Date(message.createdAt);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
          
                let formattedDate;
                if (messageDate.toDateString() === today.toDateString()) {
                  formattedDate = 'Today';
                } else if (messageDate.toDateString() === yesterday.toDateString()) {
                  formattedDate = 'Yesterday';
                } else {
                  formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(messageDate);
                }
          
                const formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(messageDate);
          
                const shouldDisplayDetails = message.senderid !== prevSenderid || formattedDate !== prevFormattedDate || formattedTime !== prevFormattedTime;
                
                prevSenderid = message.senderid;
                prevFormattedDate = formattedDate;
                prevFormattedTime = formattedTime;
          
                return (  
                <>
                    {shouldDisplayDetails ? (
                  <div className="mt-4 mr-4 flex text-white text-2xl" key={index}>
                    {shouldDisplayDetails ? (
                      <img src={message.senderAvatar} className="ml-4 rounded-full h-10 w-10 flex-shrink-0" />
                    ) : (
                      <div className="ml-4 rounded-full h-10 w-10 flex-shrink-0" />
                    )}
                    <div className="bg-black/10 backdrop-blur p-3 rounded-lg flex-grow ml-1">
                      {shouldDisplayDetails && (
                        <div className="flex mb-1 items-end">
                          <p className="text-white font-semibold text-sm mr-2">{message.sendername}</p>
                          <p className="text-white text-xs font-light items-end">{`${formattedDate} at ${formattedTime}`}</p>
                        </div>
                      )}
                      <p className="text-white text-sm font-normal">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} children={message.message} />
                      </p>
                    </div>
                  </div>
                  ) : (
                    <div className="mt-1 mr-4 flex text-white text-2xl" key={index}>
                    {shouldDisplayDetails ? (
                      <img src={message.senderAvatar} className="ml-4 rounded-full h-10 w-10 flex-shrink-0" />
                    ) : (
                      <div className="ml-4 rounded-full h-10 w-10 flex-shrink-0" />
                    )}
                    <div className="bg-black/10 backdrop-blur p-3 rounded-lg flex-grow ml-1">
                      {shouldDisplayDetails && (
                        <div className="flex mb-1 items-end">
                          <p className="text-white font-semibold text-sm mr-2">{message.sendername}</p>
                          <p className="text-white text-xs font-light items-end">{`${formattedDate} at ${formattedTime}`}</p>
                        </div>
                      )}
                      <p className="text-white text-sm font-normal">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} children={message.message} />
                      </p>
                    </div>
                  </div>
                    )} 
                  
                </>
                );
              });
            })()}
          </div>
                
        {/* WRAP MESSAGES AREA END */}        
        
        
        {/* TEXT INPUT START */}        

                
        <div className="text-white backdrop-blur-3xl border-2 border-white message-input-container justify-center items-center ">
          <form onSubmit={(event) => sendMessage(event)} className="flex">
            <div>
              <label htmlFor="messageInput" hidden>
              Enter Message
              </label>
              <textarea
                id="messageInput"
                name="messageInput"
                className="message-input bg-transparent p-4 text-white backdrop-blur-3xl "
                placeholder="type message..."
                value={inputmessage}
                onChange={(e) => setInputmessage(e.target.value)}
              />
          
            </div>
            <div className="markdown-preview">

<ReactMarkdown
  rehypePlugins={[rehypeRaw, rehypeattr]}
  remarkPlugins={[remarkGfm]}
  children={inputmessage}
  components={{
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter style={solarizedlight} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
      ) : (
        <p className="bg-blue-500" {...props}>
          {children}
        </p>
      )
    },
    blockquote({children, borderColor = 'border-yellow-500', bgColor = 'bg-yellow-300/10'}) {
      return <blockquote className={`border-l-4 ${borderColor} pl-4 ${bgColor}`}>{children}</blockquote>
    },
    del: ({node, ...props}) => <del style={{textDecoration: 'line-through'}} {...props} />, // strikethrough
  }}
/>
</div>
            <div className="grow backdrop-blur-3xl p-4">
              <button type="submit"><p>Send</p></button>
            </div>
            
          </form>
        </div>
  
        {/* TEXT INPUT START */}        


</div>
</>
);
}