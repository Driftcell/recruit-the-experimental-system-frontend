"use client";
/* eslint-disable @next/next/no-img-element */
import { faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

interface ToolProps {
  name: string;
  image: string;
}

function Tool({ name, image }: ToolProps) {
  return (
    <div className="bg-white w-[160px] h-[140px] flex flex-col items-center border rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-[100px] relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="flex-1 flex items-center justify-center text-sm font-medium p-2 text-center">
        {name}
      </div>
      <a href="#" className="text-center text-[#E8ADBA] text-sm pb-[10px]">
        试一下
      </a>
    </div>
  );
}

interface ChatDialogProps {
  message: string;
  role: string;
  isThinking?: boolean;
  tools: string[];
}

function ChatDialog({
  message,
  role,
  tools,
  isThinking = false,
}: ChatDialogProps) {
  return (
    <div
      className={`flex w-full ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex flex-col">
        <div
          className={`flex items-center mb-2 ${
            role === "user" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              role === "user" ? "bg-[#E9A79B]" : "border bg-white"
            }`}
          >
            {role === "user" ? (
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
                className="w-12 h-12 rounded-full"
              />
            )}
          </div>
          <div
            className={`flex-1 flex items-center px-4 min-h-10 whitespace-pre-wrap break-words py-2 sm:py-2.5 sm:px-5 rounded-3xl mx-4 ${
              role === "user"
                ? "rounded-tr-sm bg-[#F4D1D9]"
                : "rounded-tl-sm bg-white"
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
        {tools.length !== 0 && (
          <div className="ml-16 flex flex-row gap-3">
            {tools.map((tool, i) => (
              <Tool key={tool} name={tool} image={`/tool/${i + 1}.png`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const moods = [
  "开心/平和",
  "压力/疲惫",
  "焦虑/担忧",
  "难过/悲伤",
  "烦躁/愤怒",
  "失望/失落",
  "愧疚/羞耻",
  "无奈/冷漠",
];
const presetQuestions = [
  "在过去的两周里，你觉得在自己的心情整体状况如何？有什么特别的事情想要和我聊聊吗？",
  "试着回想一下怀孕之初或产后最初几周时的心情，与现在相比有什么变化吗？",
  "最近有什么让你困扰的事情吗？可以具体跟我讲讲发生了什么吗？",
  "在过去6个月里，你有没有经历过比较重大的变动——比如搬家、工作变动、家庭关系变化等？它们对你的情绪或日常生活带来怎样的影响？",
  "孕期或产后，作为妈妈，你觉得遇到的最大挑战是什么？能具体讲一讲吗？",
];

interface Message {
  id: string;
  role: string;
  content: string;
  tools: string[] | undefined;
}

export default function Chat() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState("");

  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [showInput, setShowInput] = useState(false);
  const [showPresetQuestions, setShowPresetQuestions] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);

  const tools = useRef<string[]>([]);

  useEffect(() => {
    console.log(tools);
  }, [tools]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "anonymous",
        password: "anonymous",
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }).then(async (res) => {
          if (res.ok) {
            const chat = await res.json();
            setChatId(chat.id);
            setAccessToken(data.access_token);
          }
        });
      });
  }, []);

  useEffect(() => {
    if (chatId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages([
            {
              id: uuidv4(),
              content:
                "Hi~妈妈,我是你的专属智能健康助手小智，今天的心情怎么样？",
              role: "assistant",
            },
            ...data.filter((message: unknown) => message.role !== "tool"),
          ]);

          console.log(data);

          if (data.length > 1) {
            setShowInput(true);
            setShowPresetQuestions(false);
          }
          setLoaded(true);
        });

      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`);

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socketRef.current.on("error", (error) => {
        setIsLoading(false);
        setCurrentAnswer("");
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            content: `发生错误：${error}`,
            role: "assistant",
            tools: [],
          },
        ]);
        console.error("Error in connection to Socket.IO:", error);
      });

      socketRef.current.on("chatUpdate", (message) => {
        setCurrentAnswer((prev) => {
          return prev + message.data.delta;
        });
      });

      socketRef.current.on("toolSuggestion", (message) => {
        console.log(message);
        tools.current = message.data.tools;
      });

      socketRef.current.on("chatComplete", () => {
        setIsLoading(false);
        setCurrentAnswer((prevAns) => {
          setMessages((prev) => {
            const suggestions = tools.current;
            tools.current = [];
            return [
              ...prev,
              {
                id: uuidv4(),
                content:
                  tools.current.length !== 0 && prevAns === ""
                    ? "已为您推荐以下工具"
                    : prevAns,
                role: "assistant",
                tools: suggestions,
              },
            ];
          });
          return "";
        });
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [chatId]);

  function handleMessage() {
    if (!input || !socketRef.current) {
      return;
    }

    setShowPresetQuestions(false);

    setMessages([
      ...messages,
      { id: uuidv4(), role: "user", content: input, tools: [] },
    ]);

    socketRef.current.emit("startChat", { chatId, message: input });
    setIsLoading(true);
    setInput("");
  }

  const handleMood = (mood: string) => {
    if (!socketRef.current) {
      return;
    }
    const message = `我现在的心情是${mood}`;
    setShowInput(true);
    setMessages([
      ...messages,
      { id: uuidv4(), role: "user", content: message, tools: [] },
    ]);
    socketRef.current.emit("insertMessage", {
      chatId,
      message,
      role: "user",
    });
  };

  const handleQuestion = (question: string) => {
    setShowPresetQuestions(false);
    setMessages([
      ...messages,
      { id: uuidv4(), role: "assistant", content: question, tools: [] },
    ]);
    socketRef.current?.emit("insertMessage", {
      chatId,
      message: question,
      role: "assistant",
    });
  };

  const handleNewChat = () => {
    setShowInput(false);
    setShowPresetQuestions(true);
    router.replace("/chat");
  };
  return (
    <div className="relative overflow-hidden min-h-[80vh] bg-[#FDF5F7]">
      <div className="max-w-6xl mx-auto pt-[20pt]">
        <img src="/banner_bg.png" alt="Banner" />
      </div>

      <div className="max-w-6xl mx-auto pt-[20pt]">
        {messages
          .filter((message) => message.role !== "system")
          .map((message) => (
            <ChatDialog
              role={message.role}
              message={message.content}
              key={message.id}
              tools={message.tools || []}
            />
          ))}

        {isLoading && (
          <ChatDialog
            role="assistant"
            message={currentAnswer}
            isThinking
            tools={[]}
          />
        )}
      </div>

      <div className="relative max-w-6xl mx-auto pt-[20pt] mb-20">
        {!showInput && loaded && (
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
        {showInput && showPresetQuestions && loaded && (
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
      </div>
      {showInput && loaded && (
        <div className="max-w-6xl absolute bottom-4 left-1/2 transform translate-x-[-50%] w-full flex-row flex items-center gap-4">
          <div className="border border-[#F3E0E0] flex flex-row items-center rounded-full bg-white px-2">
            <button
              onClick={handleNewChat}
              disabled={isLoading}
              className="flex gap-2 rounded-full py-2 px-4 text-[#E8ADBA] items-center text-sm md:tracking-widest text-nowrap disabled:opacity-50 h-16"
            >
              <img src="/plus.png" alt="New chat" className="w-4 h-4" />
              新对话
            </button>
          </div>
          <div className="w-full border border-[#F3E0E0] flex flex-row items-center rounded-full bg-white px-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="请说出您的问题"
              className="flex-1 sm:h-12 sm:mx-4 text-sm sm:text-base md:text-lg disabled:opacity-50 focus:outline-none"
              maxLength={100}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  handleMessage();
                }
              }}
            />
            <button
              onClick={handleMessage}
              disabled={isLoading}
              className="rounded-full py-2 text-white text-sm sm:text-base md:text-xl md:tracking-widest text-nowrap disabled:opacity-50"
            >
              <img src="/send.png" alt="Send message" className="w-12 h-12" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
