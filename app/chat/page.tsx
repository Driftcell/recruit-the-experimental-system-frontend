'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

interface ChatDialogProps {
  message: string
  role: string
  isThinking?: boolean
}

function ChatDialog({ message, role, isThinking = false }: ChatDialogProps) {
  return (
    <div
      className={`flex w-full ${
        role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div>
        <div
          className={`flex items-center mb-2 ${
            role === 'user' ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
              role === 'user' ? 'bg-[#E9A79B]' : 'border bg-white'
            }`}
          >
            {role === 'user' ? (
              <FontAwesomeIcon
                icon={faUser}
                className="text-white sm:text-2xl"
              />
            ) : (
              <img
                src="/chat/xiaozhi.png"
                alt="avatar"
                draggable="false"
                loading="lazy"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              />
            )}
          </div>
          <p className="text-gray-500 text-sm sm:text-xl mx-4">
            {role === 'user' ? '您' : 'AI小智'}
          </p>
        </div>

        <div
          className={`px-4 min-h-10 whitespace-pre-wrap break-words py-2 sm:py-2.5 sm:px-5 rounded-3xl mx-8 ${
            role === 'user'
              ? 'rounded-tr-lg bg-[#FDE3D4]'
              : 'rounded-tl-lg bg-gray-50 border border-gray-200'
          }`}
        >
          <Markdown
            className={`prose break-words prose-sm sm:prose-lg text-gray-800 ${
              isThinking ? 'is-thinking' : ''
            }`}
          >
            {message}
          </Markdown>
        </div>
      </div>
    </div>
  )
}

interface Message {
  id: string
  role: string
  content: string
}

function Chat() {
  const router = useRouter()
  const params = useSearchParams()

  const [messages, setMessages] = useState<Message[]>([])
  const [chatId, setChatId] = useState('')

  const [input, setInput] = useState('')
  const socketRef = useRef<Socket | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')

  useEffect(() => {
    if (!params.get('chatId')) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user_token')}`,
        },
      }).then(async (res) => {
        if (res.ok) {
          const chat = await res.json()
          router.replace(`/chat?chatId=${chat.id}`)
        }
      })
    } else {
      setChatId(params.get('chatId')!)
    }
  }, [params, router])

  useEffect(() => {
    if (chatId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user_token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages(data)
        })

      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`)

      socketRef.current.on('connect', () => {
        console.log('Connected to Socket.IO server')
      })

      socketRef.current.on('error', (error) => {
        setIsLoading(false)
        setCurrentAnswer('')
        console.error('Error in connection to Socket.IO:', error)
      })

      socketRef.current.on('chatUpdate', (message) => {
        setCurrentAnswer((prev) => {
          return prev + message.data.delta
        })
      })

      socketRef.current.on('chatComplete', () => {
        setIsLoading(false)
        setCurrentAnswer((prevAns) => {
          setMessages((prev) => [
            ...prev,
            { id: uuidv4(), content: prevAns, role: 'assistant' },
          ])
          return ''
        })
      })

      return () => {
        socketRef.current?.disconnect()
      }
    }
  }, [chatId])

  function handleMessage() {
    if (!input || !socketRef.current) {
      return
    }

    setMessages([...messages, { id: uuidv4(), role: 'user', content: input }])

    socketRef.current.emit('startChat', { chatId, message: input })
    setIsLoading(true)
    setInput('')
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <img
        src="/chat/xuancao.png"
        alt="decorative"
        draggable="false"
        loading="lazy"
        className="hidden md:block opacity-80 absolute -left-[10vw] -top-1/4 w-[160vw] h-[300vh] transform rotate-[-32.57deg] z-[-2]"
      />
      <img
        src="/chat/xuancao.png"
        alt="decorative"
        draggable="false"
        loading="lazy"
        className="md:hidden opacity-80 absolute top-[10vh] w-[80vw] h-[100vh] transform rotate-[-32.57deg] z-[-2]"
      />

      <img
        src="/chat/decoration-path.png"
        alt="decorative"
        className="absolute right-0 -bottom-0 -my-32 w-[50vw] h-[100vh] transform z-[-2]"
      />

      <div className="absolute bg-gradient-to-b from-[#FEF4EB]/[0.5] to-transparent to-60% w-full h-full z-[-1]" />
      <div className="absolute bg-gradient-to-b from-60% from-transparent to-[#FEF4EB]/[0.75] w-full h-full z-[-1]" />

      <div className="flex flex-col items-center max-w-6xl mx-auto py-8 md:py-14 px-4 sm:px-8 md:px-16">
        <div className="inline">
          <div className="relative inline-block">
            <p className="relative text-lg sm:text-3xl w-[14rem] sm:w-[24rem] text-center font-bold">
              <img
                src="/chat/bubble.svg"
                alt="decorative"
                draggable="false"
                loading="lazy"
                className="absolute top-[-5%] sm:top-[-20%] w-[25rem] z-[-1]"
              />
              嗨！我是小智🥰
            </p>
          </div>
          <img
            src="/chat/xiaozhi.png"
            alt="Xiaozhi"
            className="w-[20vw] md:w-[10rem] inline-block"
          />
        </div>

        <p className="text-gray-700 sm:text-lg indent-10 tracking-wide !leading-10 md:!leading-[3rem] lg:!leading-[4rem]">
          我们的所有会话都将保密，若出现严重情绪困扰，请及时就医。
        </p>
      </div>

      <div className="mx-10">
        {messages
          .filter((message) => message.role !== 'system')
          .map((message) => (
            <ChatDialog
              role={message.role}
              message={message.content}
              key={message.id}
            />
          ))}

        {isLoading && (
          <ChatDialog role="assistant" message={currentAnswer} isThinking />
        )}
      </div>

      <div className="relative mx-20 my-4 md:my-8 lg:my-16">
        <img
          src="/chat/xuancao-normal.png"
          alt="decorative"
          draggable="false"
          loading="lazy"
          className="bottom-[20%] right-[calc(50%-8rem)] absolute opacity-40 rotate-[11.26deg] z-[-2] w-[16rem]"
        />
        <div className="rounded-full bg-white py-2 px-2 sm:px-4 shadow-2xl flex-row flex w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="请输入您的问题"
            className="flex-1 sm:h-12 px-4 mx-1 sm:mx-4 text-sm sm:text-base md:text-lg disabled:opacity-50"
            maxLength={100}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                handleMessage()
              }
            }}
          />
          <button
            onClick={handleMessage}
            disabled={isLoading}
            className="rounded-full bg-[#E9A79B] py-2 px-4 sm:px-6 md:px-8 text-white text-sm sm:text-base md:text-xl md:tracking-widest text-nowrap disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="sm:mr-2" />{' '}
            搜索
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  )
}
