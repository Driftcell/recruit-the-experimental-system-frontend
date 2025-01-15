'use client'

/* eslint-disable @next/next/no-img-element */

import {
  faMagnifyingGlass,
  faSpinner,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
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
          className={`flex items-center px-4 min-h-10 whitespace-pre-wrap break-words py-2 sm:py-2.5 sm:px-5 rounded-3xl mx-8 ${
            role === 'user'
              ? 'rounded-tr-lg bg-[#FDE3D4]'
              : 'rounded-tl-lg bg-gray-50 border border-gray-200'
          }`}
        >
          <Markdown className="prose break-words prose-sm sm:prose-lg text-gray-800">
            {message}
          </Markdown>
          {isThinking && message.length == 0 && (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          )}
        </div>
      </div>
    </div>
  )
}

const moods = [
  '开心/平和',
  '压力/疲惫',
  '焦虑/担忧',
  '难过/悲伤',
  '烦躁/愤怒',
  '失望/失落',
  '愧疚/羞耻',
  '无奈/冷漠',
]
const presetQuestions = [
  '在过去的两周里，你觉得在自己的心情整体状况如何？有什么特别的事情想要和我聊聊吗？',
  '试着回想一下怀孕之初或产后最初几周时的心情，与现在相比有什么变化吗？',
  '最近有什么让你困扰的事情吗？可以具体跟我讲讲发生了什么吗？',
  '在过去6个月里，你有没有经历过比较重大的变动——比如搬家、工作变动、家庭关系变化等？它们对你的情绪或日常生活带来怎样的影响？',
  '孕期或产后，作为妈妈，你觉得遇到的最大挑战是什么？能具体讲一讲吗？',
]

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

  const [showInput, setShowInput] = useState(false)
  const [showPresetQuestions, setShowPresetQuestions] = useState(true)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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

          console.log(data)

          if (data.length > 1) {
            setShowInput(true)
            setShowPresetQuestions(false)
          }
        })

      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`)

      socketRef.current.on('connect', () => {
        console.log('Connected to Socket.IO server')
      })

      socketRef.current.on('error', (error) => {
        setIsLoading(false)
        setCurrentAnswer('')
        setMessages((prev) => [
          ...prev,
          { id: uuidv4(), content: `发生错误：${error}`, role: 'assistant' },
        ])
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

    setShowPresetQuestions(false)

    setMessages([...messages, { id: uuidv4(), role: 'user', content: input }])

    socketRef.current.emit('startChat', { chatId, message: input })
    setIsLoading(true)
    setInput('')
  }

  const handleMood = (mood: string) => {
    if (!socketRef.current) {
      return
    }
    const message = `我现在的心情是${mood}`
    setShowInput(true)
    setMessages([...messages, { id: uuidv4(), role: 'user', content: message }])
    socketRef.current.emit('insertMessage', {
      chatId,
      message,
      role: 'user',
    })
  }

  const handleQuestion = (question: string) => {
    setShowPresetQuestions(false)
    setMessages([
      ...messages,
      { id: uuidv4(), role: 'assistant', content: question },
    ])
    socketRef.current?.emit('insertMessage', {
      chatId,
      message: question,
      role: 'assistant',
    })
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

      <div className="mx-4 lg:mx-10">
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

      <div className="relative mx-4 lg:mx-20 my-4 md:my-8 lg:my-16">
        <img
          src="/chat/xuancao-normal.png"
          alt="decorative"
          draggable="false"
          loading="lazy"
          className="bottom-[20%] right-[calc(50%-8rem)] absolute opacity-40 rotate-[11.26deg] z-[-2] w-[16rem]"
        />
        {!showInput && (
          <div className="grid grid-cols-2 gap-4 p-4">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => handleMood(mood)}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm sm:text-base md:text-lg rounded-lg shadow-md transition-colors"
              >
                {mood}
              </button>
            ))}
          </div>
        )}
        {showInput && showPresetQuestions && (
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              从以下几个问题中选择一个开始，或直接聊天：
            </h2>
            {presetQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestion(question)}
                className="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm sm:text-base rounded-lg shadow-md text-left transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
        {showInput && (
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
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        if (data.Profile === null) {
          router.push('/profile')
        } else if (data.Profile.edps === null) {
          router.push('/edps')
        }
      }
    })
  })

  return (
    <Suspense>
      <Chat />
    </Suspense>
  )
}
