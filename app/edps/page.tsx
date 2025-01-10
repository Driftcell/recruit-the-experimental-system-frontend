"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const quiz = [
  {
    question: "我能够笑起来和看到事物有趣的一面",
    answers: [
      { value: 0, text: "同以前一样" },
      { value: 1, text: "没有以前那么多" },
      { value: 2, text: "肯定比以前少" },
      { value: 3, text: "完全不能" },
    ],
  },
  {
    question: "我期待着享受生活",
    answers: [
      { value: 0, text: "同以前一样" },
      { value: 1, text: "没有以前那么多" },
      { value: 2, text: "肯定比以前少" },
      { value: 3, text: "几乎完全不能" },
    ],
  },
  {
    question: "当事情出错时，我会不必要地责备自己",
    answers: [
      { value: 3, text: "是的，大部分时候会这样" },
      { value: 2, text: "是的，有时会这样" },
      { value: 1, text: "不，不经常这样" },
      { value: 0, text: "不，一点也没有" },
    ],
  },
  {
    question: "我会无缘无故感到焦虑和担心",
    answers: [
      { value: 0, text: "不，一点也没有" },
      { value: 1, text: "极少这样" },
      { value: 2, text: "是，有时候这样" },
      { value: 3, text: "是，经常这样" },
    ],
  },
  {
    question: "我无缘无故感到害怕和惊慌",
    answers: [
      { value: 3, text: "相当多时候这样" },
      { value: 2, text: "是的，有时候这样" },
      { value: 1, text: "不经常这样" },
      { value: 0, text: "一点也没有" },
    ],
  },
  {
    question: "很多事情冲着我来，使我透不过气",
    answers: [
      { value: 3, text: "是的，大部分时间我根本无法应对" },
      { value: 2, text: "是的，有时候我不能像往常一样应对" },
      { value: 1, text: "不，大部分时候我都能应对很好" },
      { value: 0, text: "不，我能像平时那样应对很好" },
    ],
  },
  {
    question: "我很不开心，以致难以入睡",
    answers: [
      { value: 3, text: "是的，大部分时候这样" },
      { value: 2, text: "是的，有时候这样" },
      { value: 1, text: "不经常这样" },
      { value: 0, text: "不，一点也没有" },
    ],
  },
  {
    question: "我感到难过和悲伤",
    answers: [
      { value: 3, text: "是的，大部分时间这样" },
      { value: 2, text: "是的，相当多时候这样" },
      { value: 1, text: "不经常这样" },
      { value: 0, text: "一点也没有" },
    ],
  },
  {
    question: "我很不开心一直在哭",
    answers: [
      { value: 3, text: "是的，大部分时候这样" },
      { value: 2, text: "是的，经常这样" },
      { value: 1, text: "不经常这样" },
      { value: 0, text: "一点也没有" },
    ],
  },
  {
    question: "我想到要伤害自己",
    answers: [
      { value: 3, text: "是的，经常这样" },
      { value: 2, text: "有时候这样" },
      { value: 1, text: "几乎不这样" },
      { value: 0, text: "一点也没有" },
    ],
  },
];

function Answer({
  text,
  choice,
  onSelectAnswer,
}: {
  text: string;
  choice: string;
  onSelectAnswer: (text: string) => void;
}) {
  const answerStyle = {
    label: `p-3 px-5 block cursor-pointer rounded-full border border-black border-opacity-20 mb-3 ${
      choice === text && "bg-[#E9A79B] text-white border-transparent"
    } hover:bg-[#E9A79B] hover:text-slate-100`,
    text: "ps-3 text-sm sm:text-lg font-normal",
  };

  return (
    <div>
      <label className={answerStyle.label}>
        <input
          type="radio"
          name="answer"
          checked={choice === text}
          onChange={() => {
            onSelectAnswer(text);
          }}
          className="accent-white"
        />
        <span className={answerStyle.text}>{text}</span>
      </label>
    </div>
  );
}

function Result({
  totalScore,
  score10,
  onReset,
  onUseAI,
}: {
  totalScore: number;
  score10: number;
  onReset: () => void;
  onUseAI: () => void;
}) {
  return (
    <div className="w-full">
      <div className="text-center">
        <p className="text-3xl md:text-4xl font-bold">
          {totalScore}
          <span className="text-gray-500 font-normal text-sm sm:text-lg mx-2">
            分
          </span>
        </p>

        {totalScore >= 10 && (
          <p className="sm:text-xl font-bold my-4">你可能有产后抑郁症</p>
        )}
        {score10 >= 1 && <p className="sm:text-lg my-4">请注意自杀倾向</p>}
      </div>

      <p className="my-4 max-w-3xl mx-auto text-gray-700 sm:text-lg tracking-wide !leading-10 md:!leading-[3rem] lg:!leading-[4rem]">
        EPDS评分不应该替代临床诊断，明确诊断需要进行更详细的临床评估。
        此量表并不能检测出焦虑症、恐慌症或人格障碍。
      </p>

      <div className="flex">
        <button
          onClick={onReset}
          className="mx-auto block bg-slate-400 sm:text-lg text-white px-6 sm:px-8 py-2 rounded-full"
        >
          重新测试
        </button>

        <button
          onClick={onUseAI}
          className="mx-auto block bg-[#E9A79B] sm:text-lg text-white px-6 sm:px-8 py-2 rounded-full"
        >
          使用AI小智
        </button>
      </div>
    </div>
  );
}

function Quizzes() {
  const router = useRouter();
  const [quizNo, setQuizNo] = useState(0);
  const [choice, setChoice] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);

  useEffect(() => {
    if (chosen.length === 10) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        const profile = data.Profile.extra;

        const qas = chosen.map((answer, i) => {
          return {
            question: quiz[i].question,
            answer,
          };
        });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            extra: profile,
            edps: {
              qas,
              totalScore: chosen.reduce(
                (acc, current) =>
                  acc +
                  (quiz[chosen.indexOf(current)].answers.find(
                    (answer) => answer.text === current
                  )?.value || 0),
                0
              ),
              score10:
                quiz[9].answers.find((answer) => answer.text === chosen[9])
                  ?.value || 0,
            },
          }),
        }).then((res) => {
          if (res.ok) {
            toast.info("已上传EDPS结果");
          }
        });
      });
    }
  }, [chosen]);

  const onSelectAnswer = (text: string) => {
    setChoice(text);
    setChosen([...chosen, text]);
  };

  const onPrevious = () => {
    setQuizNo(quizNo - 1);
    setChoice(chosen[quizNo - 1]);
  };

  const onNext = () => {
    setQuizNo(quizNo + 1);
    setChoice(chosen[quizNo + 1] ? chosen[quizNo + 1] : "");
  };

  const onReset = () => {
    setQuizNo(0);
    setChoice("");
    setChosen([]);
  };

  const onUseAI = () => {
    router.replace("/chat");
  };

  return (
    <div>
      <h1
        className={`${
          quizNo >= quiz.length ? "hidden" : "block"
        } tracking-widest text-sm sm:text-base my-4 flex justify-between`}
      >
        <span>爱丁堡产后抑郁量表</span>
        <span className="text-gray-500 text-sm">
          {quizNo + 1}/{quiz.length}
        </span>
      </h1>

      {quizNo < quiz.length ? (
        <div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">
            {quiz[quizNo].question}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-8">
            {quiz[quizNo].answers.map((answer, index) => (
              <Answer
                key={index}
                text={answer.text}
                choice={choice}
                onSelectAnswer={onSelectAnswer}
              />
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              disabled={quizNo === 0}
              className="border-[#E9A79B] border sm:text-lg font-normal text-[#E9A79B] px-6 sm:px-8 py-2 rounded-full disabled:opacity-50"
            >
              上一题
            </button>
            <button
              onClick={onNext}
              disabled={choice === ""}
              className="bg-[#E9A79B] sm:text-lg font-normal text-slate-100 px-6 sm:px-8 py-2 rounded-full disabled:opacity-40"
            >
              下一题
            </button>
          </div>
        </div>
      ) : (
        <Result
          totalScore={chosen.reduce(
            (acc, current) =>
              acc +
              quiz[chosen.indexOf(current)].answers.find(
                (answer) => answer.text === current
              )!.value,
            0
          )}
          score10={
            quiz[9].answers.find((answer) => answer.text === chosen[9])!.value
          }
          onReset={onReset}
          onUseAI={onUseAI}
        />
      )}
    </div>
  );
}

function Dialog() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="max-w-sm rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>提示</AlertDialogTitle>
          <AlertDialogDescription>
            产后抑郁是非常常见的生育宝宝的并发症。爱丁堡产后抑郁量表是一个快速识别围产期抑郁风险的有效工具。请您根据妈妈最近7天内感受，完成以下10个题目。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-[#E9A79B] hover:bg-[#E9A79B] text-white transition-all duration-300 ease-in-out hover:shadow-xl">
            好的
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EDPSPage() {
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        router.replace("/login");
      }

      const data = await res.json();
      const profile = data.Profile;

      if (!profile) {
        router.replace("/profile");
        return;
      }

      if (profile.edps) {
        router.replace("/chat");
        return;
      }
    });
  }, [router]);

  return (
    <div className="bg-[#FEF4EB]/[0.3]">
      <div className="max-w-6xl mx-auto py-16 lg:py-28 px-8 md:px-16 min-h-[calc(100vh-15rem)]">
        <Dialog />
        <Quizzes />
      </div>
    </div>
  );
}

export default EDPSPage;
